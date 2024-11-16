import { AuthProvider } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const isLoginPage = Component.name === "Login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <div className="h-screen bg-gray-100">
          <div className="flex">
            <Sidebar />
            <div className="flex-1">
              <Header />
              <main className="p-6">
                <Component {...pageProps} />
              </main>
            </div>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
