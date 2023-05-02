export default function Loading() {
    return (
        <div className="fixed h-screen bg-slate-900 w-screen flex flex-col justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        </div>
    )
}