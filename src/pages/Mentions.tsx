import { Breadcrumb } from 'antd';
import {motion} from 'framer-motion';
import { useEffect } from 'react';
import { HomeOutlined } from '@ant-design/icons';

const Mentions = () => {

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <Breadcrumb className="bg-[#fafafa40] p-2 rounded-full pl-5 mb-3 shadow-md">
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Politique de confidentialité</Breadcrumb.Item>
            </Breadcrumb>
            <motion.section initial="hidden" animate="visible" variants={containerVariants} className="pt-12 pb-28">
                <motion.h1
                    variants={itemVariants}
                    className="text-gray-800 text-center text-3xl font-extrabold sm:text-4xl"
                >
                    Mentions légales
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-gray-600 mx-auto text-center mt-2 max-w-[550px] font-medium"
                >
                    Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 
                    pour la Confiance dans l'économie numérique, dite L.C.E.N., nous portons à la connaissance 
                    des utilisateurs et visiteurs du site : thethetop.fr les informations suivantes :
                </motion.p>
                <div className="grid divide-y divide-neutral-200 max-w-4xl mx-auto mt-8 px-5">
                    <motion.div variants={itemVariants} className="py-4">
                        <h2 className='text-lg font-semibold'>ÉDITEUR</h2>
                        <p className='font-medium'>
                            <br />
                            Le site thethetop.fr est la propriété exclusive de <span className='font-bold'>SA Thé Tip Top</span>, qui l'édite. <br /><br />
                            <ul>
                                <li><span className='font-bold'>Thé Tip Top SA</span> au capital de : <span className='font-bold'>150 000 €</span></li>
                                <li>Tél : <span className='font-bold'>01 01 01 01 01</span></li>
                                <li>Adresse : <span className='font-bold'>18 rue Léon Frot 75011 Paris</span></li>
                                <li>Immatriculée au Registre du Commerce et des Sociétés de PARIS B 761900043 sous le numéro : <span className='font-bold'>76382761900043</span></li>
                                <li>Numéro TVA intracommunautaire : <span className='font-bold'>FR27763827619</span></li>
                                <li>Adresse de courrier électronique : <span className='font-bold'>contact@thetiptop.fr</span></li>
                                <li>Directeur de la publication : <span className='font-bold'>Mr Eric Bourdon</span></li>
                                <li>Contactez le responsable de la publication : <span className='font-bold'>e.bourdon@furiousducks.fr</span></li>
                            </ul>
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="py-4">
                        <h2 className='text-lg font-semibold'>HÉBERGEMENT</h2>
                        <p className='font-medium'>
                            <br />
                            Le site est hébergé par <span className='font-bold'>Hostinger 61 Rue Lordou Vironos 6023 Larnaca, Chypre</span>
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="py-4">
                        <h2 className='text-lg font-semibold'>DESCRIPTION DES SERVICES FOURNIS</h2>
                        <p className='font-medium'>
                            <br />
                            Le site thethetop.fr a pour objet de fournir une information concernant l’ensemble des 
                            activités de la société. Le proprietaire du site s’efforce de fournir sur le site thethetop.fr des 
                            informations aussi précises que possible. Toutefois, il ne pourra être tenue responsable des 
                            omissions, des inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait 
                            ou du fait des tiers partenaires qui lui fournissent ces informations. Tous les informations 
                            proposées sur le site thethetop.fr sont données à titre indicatif, sont non exhaustives, et 
                            sont susceptibles d’évoluer. Elles sont données sous réserve de modifications ayant été 
                            apportées depuis leur mise en ligne.
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="py-4">
                        <h2 className='text-lg font-semibold'>PROPRIÉTÉ INTELLECTUELLE ET CONTREFAÇONS</h2>
                        <p className='font-medium'>
                            <br />
                            Le proprietaire du site est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur 
                            tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, 
                            logiciels… Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des 
                            éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable à 
                            l'email : contact@thetiptop.fr . Toute exploitation non autorisée du site ou de l’un quelconque de ces 
                            éléments qu’il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément 
                            aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="py-4">
                        <h2 className='text-lg font-semibold'>LIENS HYPERTEXTES ET COOKIES</h2>
                        <p className='font-medium'>
                            <br />
                            Le site thethetop.fr contient un certain nombre de liens hypertextes vers d’autres sites (partenaires, 
                            informations …) mis en place avec l’autorisation de le proprietaire du site . Cependant, le proprietaire du site 
                            n’a pas la possibilité de vérifier le contenu des sites ainsi visités et décline donc toute responsabilité de ce fait 
                            quand aux risques éventuels de contenus illicites. L’utilisateur est informé que lors de ses visites sur le 
                            site thethetop.fr, un ou des cookies sont susceptible de s’installer automatiquement sur son ordinateur. Un 
                            cookie est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui enregistre des 
                            informations relatives à la navigation d’un ordinateur sur un site. Les données ainsi obtenues visent à faciliter 
                            la navigation ultérieure sur le site, et ont également vocation à permettre diverses mesures de fréquentation. 
                            Le paramétrage du logiciel de navigation permet d’informer de la présence de cookie et éventuellement, de 
                            refuser de la manière décrite à l’adresse suivante : www.cnil.fr Le refus d’installation d’un cookie peut 
                            entraîner l’impossibilité d’accéder à certains services. L’utilisateur peut toutefois configurer son ordinateur de 
                            la manière suivante, pour refuser l’installation des cookies : Sous Internet Explorer : onglet outil / options 
                            internet. Cliquez sur Confidentialité et choisissez Bloquer tous les cookies. Validez sur Ok. Sous Netscape : 
                            onglet édition / préférences. Cliquez sur Avancées et choisissez Désactiver les cookies. Validez sur Ok. 
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="py-4">
                        <h2 className='text-lg font-semibold'>PROTECTION DES BIENS ET DES PERSONNES - GESTION DES DONNÉES PERSONNELLES</h2>
                        <p className='font-medium'>
                            <br />
                            Utilisateur : Internaute se connectant, utilisant le site susnommé : thethetop.fr En France, les données 
                            personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 
                            2004, l'article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995.
                            <br /><br />
                            Sur le site thethetop.fr, le proprietaire du site ne collecte des informations personnelles relatives à l'utilisateur 
                            que pour le besoin de certains services proposés par le site thethetop.fr. L'utilisateur fournit ces informations 
                            en toute connaissance de cause, notamment lorsqu'il procède par lui-même à leur saisie. Il est alors précisé à 
                            l'utilisateur du site thethetop.fr l’obligation ou non de fournir ces informations. Conformément aux 
                            dispositions des articles 38 et suivants de la loi 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et 
                            aux libertés, tout utilisateur dispose d’un droit d’accès, de rectification, de suppression et d’opposition aux 
                            données personnelles le concernant. Pour l’exercer, adressez votre demande à thethetop.fr par email : email 
                            du webmaster ou en effectuant sa demande écrite et signée, accompagnée d’une copie du titre d’identité 
                            avec signature du titulaire de la pièce, en précisant l’adresse à laquelle la réponse doit être envoyée.
                            <br /><br />
                            Aucune information personnelle de l'utilisateur du site thethetop.fr n'est publiée à l'insu de l'utilisateur, 
                            échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Seule l'hypothèse du rachat du 
                            site thethetop.fr à le proprietaire du site et de ses droits permettrait la transmission des dites informations à 
                            l'éventuel acquéreur qui serait à son tour tenu de la même obligation de conservation et de modification des 
                            données vis à vis de l'utilisateur du site thethetop.fr.
                            <br /><br />
                            Le site thethetop.fr est en conformité avec le RGPD voir notre politique RGPD thethetop.fr.
                            <br /><br />
                            Les bases de données sont protégées par les dispositions de la loi du 1er juillet 1998 transposant la directive 
                            96/9 du 11 mars 1996 relative à la protection juridique des bases de données.
                        </p>
                    </motion.div>
                </div> 
            </motion.section>
        </div>
    );
}

export default Mentions