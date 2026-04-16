import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { currentUser } = useAuth();

  const cardsByRole = {
    Admin: ["Total users overview", "Role distribution", "Account deactivation controls"],
    Manager: ["Team users list", "Non-admin user edit tools", "Status monitoring"],
    User: ["My profile", "Security updates", "Account status"]
  };

  const cards = cardsByRole[currentUser?.role] || [];

  return (
    <section>
      <h1>Dashboard</h1>
      <p>
        Welcome, {currentUser?.name}. Your role is <strong>{currentUser?.role}</strong>.
      </p>

      <div className="cards-grid">
        {cards.map((card) => (
          <article key={card} className="card">
            <h3>{card}</h3>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;
