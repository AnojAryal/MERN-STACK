import { Grid, GridItem } from "@chakra-ui/react";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";


function App() {
  return (
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
        <Home />
      </GridItem>
    </Grid>
  );
}

export default App;