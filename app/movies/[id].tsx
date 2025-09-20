import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value ?? "N/A"}
    </Text>
  </View>
);

const PosterWithPlay = ({ posterUrl }: { posterUrl: string }) => (
  <View>
    <Image
      source={{ uri: posterUrl }}
      className="w-full h-[550px]"
      resizeMode="cover"
    />
    <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
      <Image source={icons.play} className="w-6 h-7 ml-1" resizeMode="cover" />
    </TouchableOpacity>
  </View>
);

const MovieStats = ({
  voteAverage,
  voteCount,
}: {
  voteAverage?: number;
  voteCount?: number;
}) => (
  <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
    <Image source={icons.star} className="size-4" />
    <Text className="text-white font-bold text-sm">
      {Math.round(voteAverage ?? 0)}/10
    </Text>
    <Text className="text-light-200 text-sm">({voteCount ?? 0} votes)</Text>
  </View>
);

const GoBackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
    onPress={onPress}
  >
    <Image
      source={icons.arrow}
      className="size-5 mr-1 mt-0.5 rotate-180"
      tintColor="#fff"
    />
    <Text className="text-white font-semibold text-base">Go Back</Text>
  </TouchableOpacity>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Poster */}
        <PosterWithPlay
          posterUrl={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
        />

        {/* Movie Info */}
        <View className="px-5 mt-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>

          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0] ?? "N/A"} •
            </Text>
            <Text className="text-light-200 text-sm">
              {movie?.runtime ?? "N/A"}m
            </Text>
          </View>

          <MovieStats
            voteAverage={movie?.vote_average}
            voteCount={movie?.vote_count}
          />

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ")}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${((movie?.budget ?? 0) / 1_000_000).toFixed(1)} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${((movie?.revenue ?? 0) / 1_000_000).toFixed(1)} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={movie?.production_companies?.map((c) => c.name).join(" • ")}
          />
        </View>
      </ScrollView>

      {/* Go Back Button */}
      <GoBackButton onPress={router.back} />
    </View>
  );
};

export default Details;
