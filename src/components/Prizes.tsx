import infuser from '../assets/img/infuseur.png'
import boitedetox from '../assets/img/boitedetox.png'
import boitesignature from '../assets/img/boitesignature.png'
import coffret39 from '../assets/img/coffret39.png'
import coffret69 from '../assets/img/coffret69.png'
import { memo } from 'react'


const Prizes = () => {

    const prizes = [
        {
            icon: <img loading='lazy' src={infuser} alt="Infuseur à thé photo" />,
            title: "Infuseur à thé",
            desc: "60% des tickets offrent un infuseur à thé. Une manière élégante de savourer nos thés bios et handmades."
        },
        {
            icon: <img loading='lazy' src={boitedetox} alt="Boite de 100g - Thé détox ou infusion photo" />,
            title: "Boite de 100g - Thé détox ou infusion",
            desc: "20% des tickets offrent une boite de 100g d’un thé détox ou d’infusion. Découvrez nos mélanges uniques."
        },
        {
            icon: <img loading='lazy' src={boitesignature} alt="Boite de 100g - Thé signature" />,
            title: "Boite de 100g - Thé signature",
            desc: "10% des tickets offrent une boite de 100g d’un de nos thés signature. Une sélection exclusive pour nos clients."
        },
        {
            icon: <img loading='lazy' src={coffret39} alt="Coffret découverte 39€" />,
            title: "Coffret découverte 39€",
            desc: "6% des tickets offrent un coffret découverte d’une valeur de 39€. Explorez notre gamme de thés bios."
        },
        {
            icon: <img loading='lazy' src={coffret69} alt="Coffret découverte 39€" />,
            title: "Coffret découverte 69€",
            desc: "4% des tickets offrent un coffret découverte d’une valeur de 69€. L’expérience ultime pour les amateurs de thé."
        },
    ]

    return (
        <section className="py-14">
            <div className="max-w-screen-xl mx-auto px-4 text-center text-gray-600 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-gray-800 text-2xl font-semibold sm:text-3xl">
                        Participez et Gagnez avec Notre Jeu-Concours Exclusif
                    </h3>
                    <p className="mt-3">
                        À l'occasion de l'ouverture de notre 10ème boutique à Nice, Thé Tip Top célèbre en offrant des récompenses garanties à chaque participation. Découvrez ci-dessous les trésors que vous pourriez débloquer avec votre achat de plus de 49€. Ne manquez pas votre chance de gagner !
                    </p>
                    <small>Un tirage au sort pour remporter un an de thé d'une valeur de 360€ aura lieu après la fin de ce jeu concours. Ne manquez pas votre chance !</small>
                </div>
                <div className="mt-12">
                    <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            prizes?.map(item => (
                                <li key={item?.title} className="space-y-3">
                                    <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                                        {item?.icon}
                                    </div>
                                    <h4 className="text-lg text-gray-800 font-semibold">
                                        {item?.title}
                                    </h4>
                                    <p>
                                        {item?.desc}
                                    </p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default memo(Prizes);    