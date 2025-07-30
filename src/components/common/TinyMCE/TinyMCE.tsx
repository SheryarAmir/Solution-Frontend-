import React, { useEffect, useRef } from 'react';

interface TinyMCEProps {
  onEditorKeyup: (content: string) => void;
}

const TinyMCE: React.FC<TinyMCEProps> = ({ onEditorKeyup }) => {
  const editorRef = useRef<any>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && hostRef.current) {
      import('tinymce').then((tinymce) => {
        tinymce.init({
          target: hostRef.current,
          plugins: ['link', 'paste', 'table'],
          skin_url: '/assets/skins/lightgray',
          setup: (editor) => {
            editorRef.current = editor;
            editor.on('keyup', () => {
              onEditorKeyup(editor.getContent());
            });
          },
          height: '320',
        });
      });
    }

    return () => {
      if (editorRef.current) {
        tinymce.remove(editorRef.current);
      }
    };
  }, [onEditorKeyup]);

  return <div ref={hostRef}></div>;
};

export default TinyMCE;