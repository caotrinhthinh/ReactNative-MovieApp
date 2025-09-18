import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  console.log("movies", movies);

  if (moviesLoading)
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginTop: 40 }}
      />
    );
  if (moviesError)
    return <Text style={{ color: "white" }}>Error: {moviesError.message}</Text>;

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="mt-2 pd-32"
        scrollEnabled={true}
        renderItem={({ item }) => <MovieCard {...item} />}
        ListHeaderComponent={
          <View className="px-5 mt-20">
            <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Latest Movies
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
