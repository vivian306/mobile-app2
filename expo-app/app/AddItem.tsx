import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // For date picker
import * as ImagePicker from "expo-image-picker"; // For image picking
import { Appbar } from "react-native-paper";

type RootStackParamList = {
  home: undefined;
  AddItem: { id: string };
};

type AddItemScreenProps = NativeStackScreenProps<RootStackParamList, "AddItem">;

type Item = {
  id: string;
  name: string;
  details: string;
  category: string;
  author: string;
  penerbit: string;
  f: string;
  publicationDate: string; // Date formatted as string
  imageUrl: string;
};

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [format, setFormat] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Handle image URL or base64
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation<AddItemScreenProps["navigation"]>();
  const route = useRoute<AddItemScreenProps["route"]>();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const currentUserId = await AsyncStorage.getItem("currentUserId");
      setUserId(currentUserId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      if (route.params.id !== "new" && userId) { 
        const storedItems = await AsyncStorage.getItem(`libraryItems_${userId}`);
        if (storedItems) {
          const allItems = JSON.parse(storedItems);
          const item = allItems.find((i: Item) => i.id === route.params.id);
          if (item) {
            setName(item.name);
            setDetails(item.details);
            setCategory(item.category);
            setAuthor(item.author);
            setPublicationDate(item.publicationDate);
            setImageUrl(item.imageUrl);
            setTitle("Edit Item");
            setPenerbit(item.penerbit);
            setFormat(item.format);
            setRating(item.rating);
          }
        }
      } else {
        setTitle("Create New Item");
      }
    };

    fetchItem();
  }, [route.params.id, userId]);

  const saveItem = async () => {
    if (userId) {
      const storedItems = await AsyncStorage.getItem(`libraryItems_${userId}`);
      const allItems = storedItems ? JSON.parse(storedItems) : [];

      if (route.params.id === "new") {
        const newItem = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          details,
          category,
          author,
          publicationDate,
          imageUrl,
          format,
          penerbit,
          rating
        };
        allItems.push(newItem);
      } else {
        const updatedItems = allItems.map((item: Item) =>
          item.id === route.params.id
            ? { ...item, name, details, category, author, publicationDate, imageUrl, format, penerbit }
            : item
        );
        allItems.splice(0, allItems.length, ...updatedItems);
      }

      await AsyncStorage.setItem(`libraryItems_${userId}`, JSON.stringify(allItems));
      navigation.navigate("home");
    } else {
      console.error("User ID is not available");
    }
  };

  const handleDateConfirm = (date: Date) => {
    setPublicationDate(date.toLocaleDateString());
    setDatePickerVisible(false);
  };

  const handleDateCancel = () => {
    setDatePickerVisible(false);
  };

  // Function to pick an image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImageUrl(result.assets[0].uri); // Set image URI
      }
    } else {
      alert("Permission to access images is required!");
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.navigate("home")} />
      <Appbar.Content title="Detail Buku" />
    </Appbar.Header>

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      <Card style={styles.card}>
      <TextInput
          label="Judul"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />
      <TextInput
          label="Penulis Buku"
          value={author}
          onChangeText={setAuthor}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Halaman"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Item Details"
          value={details}
          onChangeText={setDetails}
          style={styles.input}
          mode="outlined"
          multiline
        />
        <TextInput
          label="Nama Penerbit"
          value={penerbit}
          onChangeText={setPenerbit}
          style={styles.input}
          mode="outlined"
          multiline
        />
        <TextInput
          label="Format"
          value={format}
          onChangeText={setFormat}
          style={styles.input}
          mode="outlined"
          multiline
        />
        <TextInput
          label="Rating"
          value={rating}
          onChangeText={setRating}
          style={styles.input}
          mode="outlined"
          multiline
        />

        {/* <Button
          mode="outlined"
          onPress={() => setDatePickerVisible(true)}
          style={styles.input}
        >
          {publicationDate ? `Publication Date: ${publicationDate}` : "Select Publication Date"}
        </Button> */}
        <TextInput
          label="Image URL"
          value={imageUrl || ""}
          onChangeText={setImageUrl}
          style={styles.input}
          mode="outlined"
        />
        <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
          <Text style={styles.imagePickerText}>Select Image</Text>
        </TouchableOpacity>
        <View style={styles.imagePreviewContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <Text>No image selected</Text>
          )}
        </View>
        <Button mode="contained" onPress={saveItem} style={styles.button}>
          Save Item
        </Button>
        {/* <Button
          mode="outlined"
          onPress={() => navigation.navigate("home")}
          style={styles.buttonCancel}
        >
          Cancel
        </Button> */}
      </Card>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
    </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007BFF",
  },
  buttonCancel: {
    marginTop: 10,
    backgroundColor: "#FF5722",
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  imagePickerButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  imagePickerText: {
    color: "white",
    fontSize: 16,
  },
});
