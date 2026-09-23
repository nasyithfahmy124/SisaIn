import { useMemo, useState } from 'react';
import MapSidebar from '../../components/Map/MapSidebar';
import MapView from '../../components/Map/MapView';
import { mapItems } from '../../components/Map/mapData';

export default function Maps() {
    const [filter, setFilter] = useState('Semua');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(mapItems[0]);

    const items = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return mapItems.filter(item => {
            const material = item.material?.toLowerCase() || '';
            const need = item.need?.toLowerCase() || '';
            const title = item.title?.toLowerCase() || '';
            const address = item.address?.toLowerCase() || '';
            const filterMatch = filter === 'Semua' || material.includes(filter.toLowerCase()) || need.includes(filter.toLowerCase());
            const searchMatch = !keyword || material.includes(keyword) || need.includes(keyword) || title.includes(keyword) || address.includes(keyword);

            return filterMatch && searchMatch;
        });
    }, [filter, search]);

    return (
        <main className="min-h-[calc(100vh-72px)] bg-white">
            <div className="flex min-h-[calc(100vh-72px)] flex-col lg:flex-row">
                <MapSidebar items={items} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} selected={selected} onSelect={setSelected} />

                <section className="order-first flex-1 p-3 lg:order-last lg:p-4">
                    <MapView items={items} selected={selected} onSelect={setSelected} />
                </section>
            </div>
        </main>
    );
}