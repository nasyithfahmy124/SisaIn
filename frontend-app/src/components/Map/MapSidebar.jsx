import { Search, MapPin, Sparkles } from 'lucide-react';
import { materialFilters } from './mapData';

export default function MapSidebar({ items, filter, setFilter, search, setSearch, selected, onSelect }) {
        return (
        <aside className="flex w-full shrink-0 flex-col border-b border-gray-100 bg-[#fafbf9] lg:w-[360px] lg:border-b-0 lg:border-r">
            <div className="border-b border-gray-100 p-4">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                    <Search className="h-4 w-4 shrink-0 text-gray-400" />

                    <input
                        type="text"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="Cari material atau kebutuhan..."
                        className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                    />
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {materialFilters.map(item => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setFilter(item)}
                            className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-bold transition ${
                                filter === item
                                    ? 'bg-yellow-400 text-gray-950'
                                    : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-gray-500">
                        {items.length} titik ditemukan
                    </span>

                    <span className="text-[9px] font-medium text-gray-400">
                        Radius 5 km
                    </span>
                </div>

                <div className="space-y-2">
                    {items.map(item => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelect(item)}
                            className={`w-full rounded-2xl border p-4 text-left transition ${
                                selected?.id === item.id
                                    ? 'border-yellow-400 bg-yellow-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-yellow-200 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className={`text-[9px] font-black uppercase ${
                                    item.type === 'supply'
                                        ? 'text-emerald-600'
                                        : 'text-red-500'
                                }`}>
                                    {item.type === 'supply' ? 'Supply' : 'Demand'}
                                </span>

                                <span className="text-[9px] text-gray-400">
                                    {item.distance}
                                </span>
                            </div>

                            <h3 className="mt-2 text-sm font-black text-gray-900">
                                {item.material || item.title}
                            </h3>

                            <p className="mt-1 text-[10px] font-medium text-gray-500">
                                {item.amount}
                            </p>

                            <div className="mt-3 flex items-center gap-1.5 text-[9px] text-gray-400">
                                <MapPin size={11} />
                                <span className="truncate">{item.address}</span>
                            </div>

                            <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500">
                                    <Sparkles size={11} className="text-yellow-500" />
                                    AI Match
                                </span>

                                <span className="text-[10px] font-black text-yellow-600">
                                    {item.match || 0}%
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}