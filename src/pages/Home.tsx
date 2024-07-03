import { useEffect, lazy } from "react"
const BlogList = lazy(() => import('../components/BlogList'));
const Cookies = lazy(() => import('../components/Cookies'));
const Landing = lazy(() => import('../components/Landing'));
const Prizes = lazy(() => import('../components/Prizes'));

const Home = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Landing />
      <Prizes />
      <BlogList />
      <Cookies />
    </>
  )
}

export default Home