import { memo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks"
import { closeCookie } from "../redux/reducers/itemVisibleSlice";

const Cookies = () => {

    const {cookie} = useAppSelector(state => state.itemVisible);
    const dispatch = useAppDispatch();

    const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(closeCookie());
    }

    return (
        <>
            {cookie && <section className="fixed max-w-md p-4 mx-auto bg-white border border-gray-200 left-12 bottom-16 rounded-2xl z-50">
                <h2 className="font-semibold text-gray-800">🍪 Notification concernant les cookies.</h2>

                <p className="mt-4 text-sm text-gray-600">Nous utilisons des cookies pour nous assurer de vous offrir la meilleure expérience sur notre site web. <a href="#" className="text-green-800 hover:underline">Lisez la politique relative aux cookies</a>. </p>
                
                <div className="flex items-center justify-between mt-4 gap-x-4 shrink-0">
                    <button onClick={handleClose} className="text-xs text-gray-800 underline transition-colors duration-300 hover:text-gray-600 focus:outline-none">
                        Annuler
                    </button>

                    <button onClick={handleClose} className=" text-xs bg-gray-900 font-medium rounded-lg hover:bg-gray-700 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none">
                        Accepter
                    </button>
                </div>
            </section>}
        </>
    )
}

export default memo(Cookies);