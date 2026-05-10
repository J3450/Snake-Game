import  "react-native-gesture-handler";
import Games from "./src/components/Games";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => (
  <GestureHandlerRootView style= {{ flex: 1}}>
    <Games/>
  </GestureHandlerRootView>
);

export default App;
