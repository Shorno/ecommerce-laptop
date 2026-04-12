import NewBrandDialog from "@/app/(admin)/admin/dashboard/brands/_components/new-brand-dialog";
import BrandList from "@/app/(admin)/admin/dashboard/brands/_components/brand-list";

export default function BrandsPage() {
    return (
        <div className="container mx-auto p-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Brands</h1>
                <NewBrandDialog/>
            </header>
            <main>
                <BrandList/>
            </main>
        </div>
    );
}
