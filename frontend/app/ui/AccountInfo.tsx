
type AccountProps = {
    firstName : string;
    lastName : string;
    email : string;
}

const AccountInfo = ({firstName, lastName, email} : AccountProps) => {

    return (
        <>
            <div
                className="
                flex items-center gap-4
                rounded-3xl border border-red-200
            bg-white/90 backdrop-blur px-5 py-4 shadow-lg
                " >
                    
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
                    <span className="text-lg font-black">
                        {firstName[0]}
                        {lastName[0]}
                    </span>
                </div>

                <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-red-700">
                        Logged in as
                    </span>

                    <span className="text-lg font-extrabold tracking-tight text-slate-900">
                        {firstName} {lastName}
                    </span>

                    <span className="text-sm font-medium text-slate-600">
                        {email}
                    </span>
                </div>
            </div>
        </>
    )
}

export default AccountInfo;