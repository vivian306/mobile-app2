import { Card, Button, IconButton, TextInput } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // For date picker
import * as ImagePicker from "expo-image-picker"; // For image picking
import { Appbar } from "react-native-paper";

type RootStackParamList = {
  home: undefined;
  EditItem: { id: string };
};

type EditItemScreenProps = NativeStackScreenProps<RootStackParamList, "EditItem">;

type Item = {
  id: string;
  name: string;
  details: string;
  category: string;
  author: string;
  publicationDate: string; // Date formatted as string
  imageUrl: string;
  penerbit: string;
  format: string;
};

const BookDetailScreen = () => {

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [format, setFormat] = useState("");
  const [rating, setRating] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Handle image URL or base64
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation<EditItemScreenProps["navigation"]>();
  const route = useRoute<EditItemScreenProps["route"]>();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const currentUserId = await AsyncStorage.getItem("currentUserId");
      setUserId(currentUserId);
    };
    fetchUserId();
  }, []);

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
          penerbit,
          format,
          rating
        };
        allItems.push(newItem);
      } else {
        const updatedItems = allItems.map((item: Item) =>
          item.id === route.params.id
            ? { ...item, name, details, category, author, publicationDate, imageUrl, penerbit, format, rating }
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
            setPenerbit(item.penerbit);
            setFormat(item.format);
            setRating(item.rating);
            // setTitle("Edit Item");
          }
        }
      } else {
        // setTitle("Create New Item");
      }
    };

    fetchItem();
  }, [route.params.id, userId]);

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
      <Card style={styles.card}>
         <View style={styles.imagePreviewContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <Text>No image selected</Text>
          )}
        </View>
        <View style={styles.detailsContainer}>
        <View style={styles.titleRow}> 
          <Text style={styles.title}>{title}</Text>
          <Text>Rating : {rating}</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={[styles.text, { flex: 1 }]}>Penulis: {author}</Text>
          <View style={styles.iconContainer}>
            <IconButton icon="bell" size={24} onPress={() => {}} />
            <IconButton icon="share" size={24} onPress={() => {}} />
          </View>
        </View>
        
          <Text style={styles.text}>Halaman: {category}</Text>
          <Text style={styles.text}>Penerbit: {penerbit}</Text>
          <Text style={styles.text}>Format: {format}</Text>
          {/* <Text style={styles.text}>Rating: {rating}</Text> */}
          
          <Text style={styles.descriptionTitle}>Deskripsi Buku</Text>
          <Text style={styles.description}>{details}</Text>
        </View>
        {/* <Button mode="contained" style={styles.button} onPress={() => {}}>
          Save Item
        </Button> */}
      </Card>
    </ScrollView>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#e0e0e0",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#fff",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 8,
  },
  title: {
    flex: 1,  // Agar teks memenuhi sisa ruang & ikon tetap di kanan
    fontSize: 24,
    fontWeight: "bold",
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
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#6200ee",
  },
});

export default BookDetailScreen;
