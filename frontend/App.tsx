import "react-native-gesture-handler";
import { AuthProvider } from "./src/context/AuthContext";
import { SignUpProvider } from "./src/context/SignUpContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <SignUpProvider>
        <AppNavigator />
      </SignUpProvider>
    </AuthProvider>
  );
}
