import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  DetailScreen: { id: string };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, "DetailScreen">;

interface Item {
  id: string;
  imageUrl: string;
  name: string;
  details: string;
  category: string;
  author: string;
  publicationDate: string;
}

const DetailScreen: React.FC<{ route: DetailScreenRouteProp }> = ({ route }) => {
  const { id } = route.params; // Ambil ID dari parameter navigasi
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const storedItem = await AsyncStorage.getItem(`item_${id}`);
        if (storedItem) {
          setItem(JSON.parse(storedItem));
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
       <Text style={styles.detail}><Text style={styles.label}>Judul Buku:</Text> {item.name}</Text>
        {/* <Text style={styles.title}>{item.name}</Text> */}
        {/* <Text style={styles.detail}><Text style={styles.label}>Details:</Text> {item.details}</Text> */}
        {/* <Text style={styles.detail}><Text style={styles.label}>Category:</Text> {item.category}</Text> */}
        <Text style={styles.detail}><Text style={styles.label}>Penulis Buku:</Text> {item.author}</Text>
        {/* <Text style={styles.detail}><Text style={styles.label}>Publication Date:</Text> {item.publicationDate}</Text> */}
      </View>
    </ScrollView>
  ); 
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: "100%", height: 200, resizeMode: "cover" },
  detailsContainer: { marginTop: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  detail: { fontSize: 16, marginBottom: 4 },
  label: { fontWeight: "bold" },
});

export default DetailScreen;
