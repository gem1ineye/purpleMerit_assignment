import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="center-wrap">
      <h1>Page not found</h1>
      <Link className="btn" to="/dashboard">
        Go to dashboard
      </Link>
    </section>
  );
};

export default NotFoundPage;
