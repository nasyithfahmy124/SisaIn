import ProfileDesktop from '../../components/Profile/ProfileDesktop';

import ProfileMobile from '../../components/Profile/ProfileMobile';

import { useProfile } from '../../hooks/useProfile';


export default function Profile() {

    const profile = useProfile();


    if (profile.isLoading) return <ProfileLoading />;

    if (profile.error) return <ProfileError />;


    return (

        <main className="min-h-screen bg-[#faf9f7]">

            <div className="hidden lg:block">

                <ProfileDesktop {...profile} />

            </div>


            <div className="lg:hidden">

                <ProfileMobile {...profile} />

            </div>

        </main>

    );

}


function ProfileLoading() {

    return (

        <main className="grid min-h-screen place-items-center bg-[#faf9f7]">

            <div className="flex flex-col items-center gap-3">

                <div className="h-9 w-9 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />

                <span className="text-xs font-medium text-gray-400">Memuat profil...</span>

            </div>

        </main>

    );

}


function ProfileError() {

    return (

        <main className="grid min-h-screen place-items-center bg-[#faf9f7] px-6">

            <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-sm">

                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-500">

                    !

                </div>


                <h2 className="mt-4 text-base font-black text-gray-900">

                    Gagal memuat profil

                </h2>


                <p className="mt-1 text-xs leading-relaxed text-gray-500">

                    Data profil tidak dapat dimuat. Silakan login kembali.

                </p>

            </div>

        </main>

    );

} 