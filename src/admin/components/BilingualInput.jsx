/**
 * BilingualInput — renders a side-by-side EN / AR input pair.
 * Props:
 *   label       — field label
 *   nameEn      — form field name for English value
 *   nameAr      — form field name for Arabic value
 *   valueEn     — controlled value EN
 *   valueAr     — controlled value AR
 *   onChange    — handler (e) => void  (works for both)
 *   required    — bool
 *   multiline   — renders textarea instead of input
 *   rows        — textarea rows (default 3)
 *   placeholder — optional EN placeholder
 */
export default function BilingualInput({
  label,
  nameEn,
  nameAr,
  valueEn = '',
  valueAr = '',
  onChange,
  required = false,
  multiline = false,
  rows = 3,
  placeholder = '',
}) {
  const sharedCls =
    'w-full border border-[#E4EBF5] rounded-lg px-3 py-2 text-sm text-[#071525] bg-white ' +
    'focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB]/20 transition';

  const field = (name, value, dir, ph) =>
    multiline ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={ph}
        dir={dir}
        className={`${sharedCls} resize-none`}
      />
    ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={ph}
        dir={dir}
        className={sharedCls}
      />
    );

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-[#5A7896] uppercase tracking-wide mb-2">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold bg-[#1A6FDB] text-white px-1.5 py-0.5 rounded">EN</span>
          </div>
          {field(nameEn, valueEn, 'ltr', placeholder || `English ${label || ''}`)}
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold bg-[#071525] text-white px-1.5 py-0.5 rounded">AR</span>
          </div>
          {field(nameAr, valueAr, 'rtl', `عربي ${label || ''}`)}
        </div>
      </div>
    </div>
  );
}
