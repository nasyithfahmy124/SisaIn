export default function ProfileSkeleton({ mobile = false }) {
    return mobile ? <MobileSkeleton /> : <DesktopSkeleton />;
}

function DesktopSkeleton() {
    return (
        <div className="mx-auto max-w-[1280px] animate-pulse px-8 py-12">
            <HeroSkeleton />

            <div className="mt-6 grid grid-cols-[1fr_320px] gap-5">
                <HistorySkeleton />

                <aside className="space-y-4">
                    <ImpactSkeleton />
                    <CertificateSkeleton />
                    <ActionSkeleton />
                </aside>
            </div>

            <FooterSkeleton />
        </div>
    );
}

function MobileSkeleton() {
    return (
        <div className="animate-pulse px-4 pb-24 pt-4">
            <MobileHeaderSkeleton />
            <MobileHeroSkeleton />
            <HistorySkeleton mobile />
            <ImpactSkeleton mobile />
            <CertificateSkeleton mobile />
            <ActionSkeleton mobile />
            <BottomNavSkeleton />
        </div>
    );
}

function HeroSkeleton() {
    return (
        <section className="flex min-h-[157px] items-center justify-between rounded-[28px] bg-yellow-300 px-7 py-6">
            <div className="space-y-3">
                <div className="h-5 w-28 rounded-full bg-yellow-200" />
                <div className="h-10 w-80 rounded-xl bg-yellow-200" />
                <div className="h-4 w-64 rounded-full bg-yellow-200" />
                <div className="h-5 w-36 rounded-full bg-yellow-200" />
            </div>

            <div className="flex gap-3">
                <StatSkeleton />
                <StatSkeleton />
            </div>
        </section>
    );
}

function StatSkeleton() {
    return (
        <div className="w-[150px] rounded-2xl bg-white p-4">
            <div className="h-5 w-16 rounded-full bg-gray-200" />
            <div className="mt-3 h-8 w-20 rounded-lg bg-gray-200" />
            <div className="mt-2 h-3 w-24 rounded-full bg-gray-100" />
        </div>
    );
}

function HistorySkeleton({ mobile = false }) {
    return (
        <section className={mobile ? 'mt-5' : ''}>
            <div className="mb-4 flex items-center justify-between">
                <div className="h-6 w-48 rounded-lg bg-gray-200" />

                {!mobile && (
                    <div className="h-8 w-32 rounded-full bg-gray-200" />
                )}
            </div>

            {mobile && (
                <div className="mb-3 flex gap-2">
                    <div className="h-7 w-16 rounded-full bg-gray-200" />
                    <div className="h-7 w-20 rounded-full bg-gray-200" />
                    <div className="h-7 w-20 rounded-full bg-gray-200" />
                </div>
            )}

            <div className="space-y-3">
                <HistoryItemSkeleton />
                <HistoryItemSkeleton />
                <HistoryItemSkeleton compact={mobile} />
            </div>
        </section>
    );
}

function HistoryItemSkeleton({ compact = false }) {
    return (
        <div className={`rounded-2xl bg-white p-3 shadow-sm ${compact ? 'min-h-[70px]' : 'min-h-[92px]'}`}>
            <div className="flex gap-3">
                <div className="h-14 w-24 shrink-0 rounded-xl bg-gray-200" />

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-20 rounded-full bg-gray-200" />
                        <div className="h-3 w-12 rounded-full bg-gray-100" />
                    </div>

                    <div className="h-4 w-3/4 rounded-md bg-gray-200" />
                    <div className="h-3 w-1/2 rounded-full bg-gray-100" />
                </div>

                <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
            </div>
        </div>
    );
}

function ImpactSkeleton({ mobile = false }) {
    return (
        <section className={`rounded-2xl bg-white p-4 shadow-sm ${mobile ? 'mt-4' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="h-5 w-28 rounded-md bg-gray-200" />
                <div className="h-5 w-14 rounded-full bg-gray-100" />
            </div>

            <div className="mt-4 rounded-xl bg-gray-100 p-4">
                <div className="h-8 w-24 rounded-lg bg-gray-200" />
                <div className="mt-2 h-3 w-40 rounded-full bg-gray-200" />
            </div>

            <div className="mt-3 rounded-xl bg-yellow-50 p-4">
                <div className="h-4 w-32 rounded-md bg-yellow-100" />
                <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded-full bg-yellow-100" />
                    <div className="h-3 w-4/5 rounded-full bg-yellow-100" />
                    <div className="h-3 w-3/5 rounded-full bg-yellow-100" />
                </div>
            </div>

            <div className="mt-4">
                <div className="h-3 w-28 rounded-full bg-gray-200" />
                <div className="mt-2 h-4 w-full rounded-md bg-gray-200" />
                <div className="mt-2 h-3 w-4/5 rounded-full bg-gray-100" />
                <div className="mt-3 h-2 w-full rounded-full bg-gray-200" />
            </div>

            <div className="mt-4 h-10 w-full rounded-full bg-gray-200" />
        </section>
    );
}

function CertificateSkeleton({ mobile = false }) {
    return (
        <section className={`rounded-2xl bg-white p-4 shadow-sm ${mobile ? 'mt-3' : ''}`}>
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-200" />

                <div className="flex-1">
                    <div className="h-4 w-40 rounded-md bg-gray-200" />
                    <div className="mt-2 h-3 w-32 rounded-full bg-gray-100" />
                </div>

                <div className="h-7 w-7 rounded-lg bg-gray-200" />
            </div>
        </section>
    );
}

function ActionSkeleton({ mobile = false }) {
    return (
        <section className={`rounded-2xl bg-white p-4 shadow-sm ${mobile ? 'mt-3' : ''}`}>
            <div className="h-4 w-32 rounded-md bg-gray-200" />
            <div className="mt-2 h-3 w-44 rounded-full bg-gray-100" />

            <div className="mt-4 flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-3 w-28 rounded-full bg-gray-100" />
                    <div className="h-3 w-20 rounded-full bg-gray-100" />
                </div>

                <div className="h-9 w-24 rounded-full bg-gray-200" />
            </div>
        </section>
    );
}

function MobileHeaderSkeleton() {
    return (
        <header className="flex items-center justify-between">
            <div className="h-5 w-16 rounded-md bg-gray-200" />

            <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-gray-200" />
                <div className="h-9 w-9 rounded-full bg-gray-200" />
            </div>
        </header>
    );
}

function MobileHeroSkeleton() {
    return (
        <section className="mt-3 rounded-3xl bg-yellow-300 p-4">
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-yellow-200" />

                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded-md bg-yellow-200" />
                    <div className="h-3 w-40 rounded-full bg-yellow-200" />
                </div>
            </div>

            <div className="mt-3 h-5 w-48 rounded-md bg-yellow-200" />
            <div className="mt-2 h-3 w-full rounded-full bg-yellow-200" />

            <div className="mt-4 grid grid-cols-2 gap-2">
                <MobileStatSkeleton />
                <MobileStatSkeleton />
            </div>
        </section>
    );
}

function MobileStatSkeleton() {
    return (
        <div className="rounded-xl bg-white p-3">
            <div className="h-3 w-12 rounded-full bg-gray-200" />
            <div className="mt-2 h-7 w-20 rounded-lg bg-gray-200" />
            <div className="mt-1 h-2 w-16 rounded-full bg-gray-100" />
        </div>
    );
}

function BottomNavSkeleton() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center justify-around border-t border-gray-100 bg-white px-4">
            {[1, 2, 3, 4].map(item => (
                <div key={item} className="flex flex-col items-center gap-1">
                    <div className="h-5 w-5 rounded-md bg-gray-200" />
                    <div className="h-2 w-10 rounded-full bg-gray-100" />
                </div>
            ))}
        </div>
    );
}

function FooterSkeleton() {
    return (
        <footer className="mt-16 flex items-center justify-between">
            <div className="h-5 w-24 rounded-md bg-gray-200" />
            <div className="h-3 w-64 rounded-full bg-gray-100" />
        </footer>
    );
}