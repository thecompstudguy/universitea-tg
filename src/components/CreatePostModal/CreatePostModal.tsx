import { Button, FileInput, IconButton, List, Modal, Section, Text, Textarea } from '@telegram-apps/telegram-ui';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { TeaMedia } from '@/data/tea.ts';

import './CreatePostModal.css';

type DraftMedia = {
  id: string;
  type: TeaMedia['type'];
  file: File;
  url: string;
};

export type CreatePostPayload = {
  body: string;
  media: TeaMedia[];
};

function makeId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function CloseIcon() {
  return (
    <svg
      className="create-post-modal__close-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg
      className="create-post-modal__remove-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function syncDialogA11yIds(contentEl: HTMLElement) {
  const dialogEl = contentEl.getAttribute('role') === 'dialog'
    ? contentEl
    : contentEl.querySelector<HTMLElement>('[role="dialog"]') ?? contentEl;

  const titleId = dialogEl.getAttribute('aria-labelledby');
  const descriptionId = dialogEl.getAttribute('aria-describedby');

  if (titleId) {
    const titleEl = contentEl.querySelector('.create-post-modal__a11y-title');
    if (titleEl instanceof HTMLElement) {
      titleEl.id = titleId;
    } else {
      const headerEl = contentEl.querySelector('.create-post-modal__header');
      if (headerEl instanceof HTMLElement) headerEl.id = titleId;
    }

    if (!document.getElementById(titleId)) {
      const srTitle = document.createElement('h2');
      srTitle.id = titleId;
      srTitle.className = 'create-post-modal__sr-only';
      srTitle.textContent = 'Create post';
      dialogEl.insertBefore(srTitle, dialogEl.firstChild);
    }
  }

  if (descriptionId) {
    const descriptionEl = contentEl.querySelector('.create-post-modal__a11y-description');
    if (descriptionEl instanceof HTMLElement) {
      descriptionEl.id = descriptionId;
    } else {
      const hintEl = contentEl.querySelector('.create-post-modal__hint');
      if (hintEl instanceof HTMLElement) hintEl.id = descriptionId;
    }

    if (!document.getElementById(descriptionId)) {
      const srDesc = document.createElement('p');
      srDesc.id = descriptionId;
      srDesc.className = 'create-post-modal__sr-only';
      srDesc.textContent = 'Tip: keep it general. If it’s identifiable, redact it.';
      dialogEl.appendChild(srDesc);
    }
  }
}

export const CreatePostModal: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: CreatePostPayload) => void;
}> = ({ open, onOpenChange, onCreate }) => {
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const setDialogContentRef = useCallback((node: HTMLDivElement | null) => {
    dialogContentRef.current = node;
    if (node) syncDialogA11yIds(node);
  }, []);
  const [body, setBody] = useState('');
  const [draftMedia, setDraftMedia] = useState<DraftMedia[]>([]);

  const canSubmit = useMemo(() => body.trim().length > 0 || draftMedia.length > 0, [body, draftMedia.length]);

  useEffect(() => {
    if (open) return;
    setBody('');
    setDraftMedia((prev) => {
      prev.forEach((m) => URL.revokeObjectURL(m.url));
      return [];
    });
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = dialogContentRef.current;
    if (el) syncDialogA11yIds(el);
  }, [open]);

  const postMedia = useMemo<TeaMedia[]>(
    () => draftMedia.map((m) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      fileName: m.file.name,
      mimeType: m.file.type,
      size: m.file.size,
    })),
    [draftMedia],
  );

  function addFiles(files: FileList | null) {
    if (!files) return;

    setDraftMedia((prev) => {
      const next = [...prev];

      for (const file of Array.from(files)) {
        const mimeType = file.type || '';
        let type: TeaMedia['type'] | undefined;

        if (mimeType.startsWith('image/')) type = 'image';
        else if (mimeType.startsWith('video/')) type = 'video';
        else continue;

        next.push({
          id: makeId('media'),
          type,
          file,
          url: URL.createObjectURL(file),
        });
      }

      return next;
    });
  }

  function removeMedia(id: string) {
    setDraftMedia((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((m) => m.id !== id);
    });
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    addFiles(e.currentTarget.files);
    e.currentTarget.value = '';
  }

  return (
    <Modal
      ref={setDialogContentRef}
      open={open}
      onOpenChange={onOpenChange}
      modal
      dismissible
      header={(
        <Modal.Header
          className="create-post-modal__header"
          after={(
            <Modal.Close>
              <IconButton size="m" mode="plain" aria-label="Close">
                <CloseIcon/>
              </IconButton>
            </Modal.Close>
          )}
        >
          Create post
        </Modal.Header>
      )}
    >
      <h2 className="create-post-modal__sr-only create-post-modal__a11y-title">Create post</h2>
      <p className="create-post-modal__sr-only create-post-modal__a11y-description">
        Tip: keep it general. If it’s identifiable, redact it.
      </p>
      <List>
        <Section header="What’s the tea?">
          <Textarea
            header="Post text"
            placeholder="Taglish ok. No names, no doxxing."
            value={body}
            onChange={(e) => setBody(e.currentTarget.value)}
          />
        </Section>
        <Section header="Media" footer="You can add multiple photos and/or videos.">
          <FileInput
            label="Add photos/videos"
            accept="image/*,video/*"
            multiple
            onChange={onFileChange}
          />
          {draftMedia.length > 0 && (
            <div className="create-post-modal__media-grid">
              {draftMedia.map((m) => (
                <div key={m.id} className="create-post-modal__media-item">
                  {m.type === 'image' ? (
                    <img
                      className="create-post-modal__media-preview"
                      src={m.url}
                      alt={m.file.name || 'Uploaded image'}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <video
                      className="create-post-modal__media-preview"
                      src={m.url}
                      muted
                      controls
                      playsInline
                      preload="metadata"
                    />
                  )}
                  <IconButton
                    className="create-post-modal__remove"
                    size="s"
                    mode="plain"
                    aria-label="Remove media"
                    onClick={() => removeMedia(m.id)}
                  >
                    <RemoveIcon/>
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </Section>
        <div className="create-post-modal__actions">
          <Text className="create-post-modal__hint">
            Tip: keep it general. If it’s identifiable, redact it.
          </Text>
          <Button
            className="create-post-modal__post-btn"
            stretched
            size="l"
            mode="filled"
            disabled={!canSubmit}
            onClick={() => {
              onCreate({ body: body.trim(), media: postMedia });
              setBody('');
              setDraftMedia([]);
              onOpenChange(false);
            }}
          >
            Post
          </Button>
        </div>
      </List>
    </Modal>
  );
};
