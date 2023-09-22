import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./LoginPage";
import NoteList from "./NoteList";
import ResponsiveAppBar from "./ResponsiveAppBar";
import LinearProgress from "@mui/material/LinearProgress";
function Home() {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  if (isLoading) return <LinearProgress />;

  async function setidToken() {
    if (isAuthenticated) {
      await getIdTokenClaims().then((res) => {
        sessionStorage.setItem("idToken", String(res?.__raw));
      });
    }
  }
  setidToken();

  return (
    <>
      {isAuthenticated ? (
        <>
          <ResponsiveAppBar></ResponsiveAppBar>
          <NoteList></NoteList>
        </>
      ) : (
        <>
          <LoginPage></LoginPage>
        </>
      )}
    </>
  );
}

export default Home;
