import { AuthProvider } from "./components/AuthContext";
import AppRoutes from "./router";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";

function App() {
  return (
    <AuthProvider>
      <Grid
        templateAreas={{
          base: `"navbar" "main"`,
          md: `"navbar navbar" "main main"`,
        }}
        gridTemplateRows="auto 1fr"
        gridTemplateColumns="1fr"
        h="100vh"
        gap="4"
      >
        <GridItem area="navbar" as="header" w="100%">
          <NavBar />
        </GridItem>
        <GridItem area="main" as="main" w="100%" p="4">
          <AppRoutes />
        </GridItem>
      </Grid>
    </AuthProvider>
  );
}

export default App;
