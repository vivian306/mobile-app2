import React, { useEffect, useState } from "react";
import { View, FlatList, TextInput, StyleSheet, Image, Dimensions } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get("window");
const numColumns = width > 100 ? 2 : 1; // Jika layar lebih besar dari 600px, gunakan 2 kolom
const cardWidth = (width / 2 )- 50; // Atur ukuran kartu agar pas dalam grid

type RootStackParamList = {
  Home: undefined;
  EditItem: { id: string };
  AddItem : {id: string};
  index: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type Item = {
  id: string;
  name: string;
  details: string;
  category: string;
  author: string;
  publicationDate: string;
  imageUrl: string;
};

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchUserId = async () => {
      const currentUserId = await AsyncStorage.getItem("currentUserId");
      setUserId(currentUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (userId) {
        const storedItems = await AsyncStorage.getItem(`libraryItems_${userId}`);
        if (storedItems) {
          const items = JSON.parse(storedItems);
          setItems(items);
          setFilteredItems(items); // Initialize with all items
        }
      }
    };

    fetchItems();
  }, [userId]);

  const filterItems = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = items.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(lowercasedQuery)) ||
        (item.details && item.details.toLowerCase().includes(lowercasedQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredItems(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterItems(query);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <Card style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      ) : (
        <Text style={styles.noImageText}>No Image Available</Text>
      )}
      <Card.Content>
        {/* <Text style={styles.cardTitle}>{item.name}</Text> */}
        <Text style={styles.cardMeta}><Text >Judul Buku: </Text> <Text>{item.name}</Text></Text>
        {/* <Text style={styles.cardMeta}>Category: {item.category}</Text> */}
        <Text style={styles.cardMeta}><Text>Penulis Buku: </Text> <Text>{item.author}</Text></Text>
        {/* <Text style={styles.cardMeta}>Published on: {item.publicationDate}</Text> */}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate("EditItem", { id: item.id })}>
          Detail
        </Button>
      </Card.Actions>
    </Card>
  );

  const handleAddNewItem = () => { 
    if (userId) {
      // navigation.navigate("AddItem", {id:});
      navigation.navigate("AddItem", { id: "new" });
    } else {
      console.error("Cannot add item: userId is null.");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUserId");
    navigation.navigate("index"); // Redirect ke halaman Login
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchQuery}
        onChangeText={handleSearchChange}
        placeholder="Search for items..."
        style={styles.searchInput}
      />
      <View style={styles.emptyBox}>
        <Text style={styles.emptyBoxText}>Buku Baru Andalan Januari 2025</Text>
        <Text style={styles.emptyBoxText}>1-31 Januari 2025</Text>
        <View style={styles.filterBox}>
          <Icon name="bars" size={20} color="#2c3e50" />
          <Text style={styles.filterText}>Filter</Text>
        </View>

      </View>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      />
      <Button mode="contained" onPress={handleAddNewItem} style={styles.addButton}>
        Add New Item
      </Button>
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  flatList: {
    paddingBottom: 20,
  },
  emptyBox: {
    height: 150, // Tinggi kotak kosong
    backgroundColor: '#D2D1E5', // Warna kotak kosong (abu-abu)
    marginBottom: 10, // Jarak dengan FlatList
    paddingTop: 7,
    paddingLeft: 10,
    borderRadius: 5, // Sudut kotak yang sedikit melengkung
    justifyContent: 'flex-start', // Agar teks berada di tengah secara vertikal
    alignItems: 'flex-start', // Agar teks berada di tengah secara horizontal
  },
  emptyBoxText: {
    fontSize: 18, // Ukuran font untuk teks
    color: "#7f8c8d", // Warna teks
    textAlign: "center", // Meratakan teks di tengah
  },
  filterBox: {
    flexDirection: 'row', // Ikon dan teks dalam satu baris
    alignItems: 'center', // Menyusun ikon dan teks secara vertikal
    marginTop: 20,
    padding: 10,
    // paddingEnd: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  filterText: {
    fontSize: 16,
    color: "#2c3e50",
    marginLeft: 10,
    textAlign: "center",
  },
  row: {
    flex: 1, // Tambahkan agar elemen dalam baris merata
    justifyContent: "space-between",
  },
  card: {
    width: cardWidth, // Ukuran kartu disesuaikan agar pas dalam grid
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    alignSelf: "stretch", // Pastikan kartu melebar
  },
  cardImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  noImageText: {
    textAlign: "center",
    padding: 10,
    color: "#7f8c8d",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  cardMeta: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#27ae60",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#e74c3c",
  },
  searchInput: {
    height: 45,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
