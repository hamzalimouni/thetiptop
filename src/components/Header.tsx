import Breadcrumbs from "./Breadcrumbs"

type Props = {
    path: string[];
}

const Header = (props: Props) => {
    return (
        <div className="items-start justify-between py-4 border-b md:flex">
            <div className="max-w-lg px-4 md:px-8">
                <Breadcrumbs path={props.path} />
            </div>
        </div>
    )
}

export default Header