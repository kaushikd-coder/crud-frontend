

function FilterModal({
    open, onClose,
    value, onChange,
    onApply, onClear,
}: {
    open: boolean;
    value: any;                       
    onChange: (p: Partial<any>) => void; 
    onApply: () => void;                      
    onClear: () => void;
    onClose: () => void;
}) {
    if (!open) return null;

    const set = (p: Partial<any>) => onChange(p);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-[95%] max-w-lg rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-5 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Filter Tasks</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="text-sm">
                        <span className="block mb-1 opacity-80">Status</span>
                        <select
                            className="w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-2 py-2"
                            value={value.status ?? ""}
                            onChange={e => set({ status: e.target.value as any["status"] })}
                        >
                            <option value="">Any</option>
                            <option value="todo">Todo</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </label>

                    <label className="text-sm">
                        <span className="block mb-1 opacity-80">Priority</span>
                        <select
                            className="w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-2 py-2"
                            value={value.priority ?? ""}
                            onChange={e => set({ priority: e.target.value as any["priority"] })}
                        >
                            <option value="">Any</option>
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="high">high</option>
                        </select>
                    </label>

                



                    <label className="text-sm">
                        <span className="block mb-1 opacity-80">Order</span>
                        <select
                            className="w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-2 py-2"
                            value={value.order ?? "desc"}
                            onChange={e => set({ order: e.target.value as "asc" | "desc" })}
                        >
                            <option value="desc">Desc</option>
                            <option value="asc">Asc</option>
                        </select>
                    </label>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    <button
                        onClick={() => { onClear(); }}
                        className="rounded-md border border-[var(--panel-border)] px-3 py-1 text-sm hover:bg-[var(--panel-border)]/30"
                    >
                        Clear
                    </button>
                    <button
                        onClick={onApply}
                        className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-500"
                    >
                        Apply
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded-md px-3 py-1 text-sm hover:bg-[var(--panel-border)]/30"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterModal;