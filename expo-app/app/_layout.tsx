import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="explore" options={{ title: 'Explore' }} />
      <Stack.Screen name="login" options={{ headerShown: false}} /> 
      <Stack.Screen name="signup" options={{ headerShown: false}} />
      <Stack.Screen name="home" options={{ headerShown: false}} />
      {/* <Stack.Screen name="AddBook" options={{ title: 'Explore' }} /> */}
      <Stack.Screen name="EditItem" options={{ headerShown: false}} />
      <Stack.Screen name="AddItem" options={{ headerShown: false}} /> 
    </Stack>
  );
}

