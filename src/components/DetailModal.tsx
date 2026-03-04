import Modal from "./Modal";

export interface DetailField {
  label: string;
  value: React.ReactNode;
  /** span both columns */
  wide?: boolean;
}

export interface DetailSection {
  title?: string;
  fields: DetailField[];
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sections: DetailSection[];
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  sections,
}: DetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 mt-1">
                {section.title}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {section.fields.map((field, j) => (
                <div
                  key={j}
                  className={`bg-surface-elevated rounded-xl px-3 py-2.5 ${field.wide ? "col-span-2" : ""}`}
                >
                  <p className="text-[10px] text-text-muted mb-0.5">
                    {field.label}
                  </p>
                  <div className="text-sm text-text-primary font-medium leading-snug">
                    {field.value ?? (
                      <span className="text-text-muted font-normal">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
