import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
import { getLeafletHTML } from "../utils/leafletMap";
import { WebView } from "react-native-webview";
import { endRoom } from "../services/api";

export default function LiveTrackingScreen({ navigation, route }) {
  const { isDark, colors } = useTheme();
  const { user } = useAuth();
  const s = makeStyles(colors);

  const room = route.params?.room;

  const [members, setMembers] = useState([]);
  const [myLocation, setMyLocation] = useState(null);
  const [connected, setConnected] = useState(false);
  const locationSub = useRef(null);

  const cleanup = useCallback(() => {
    const socket = getSocket();
    if (socket && room?.code) {
      socket.emit("leave_room", { roomCode: room.code });
    }
    disconnectSocket();
    if (locationSub.current) {
      locationSub.current.remove();
      locationSub.current = null;
    }
  }, [room]);

  const setupSocket = useCallback(async () => {
    try {
      const socket = await connectSocket();

      socket.on("connect", () => {
        setConnected(true);
        if (room?.code) {
          socket.emit("join_room", { roomCode: room.code });
        }
      });

      socket.on("room_members", (serverMembers) => {
        setMembers(serverMembers.filter((m) => m.userId !== user?.id));
      });

      socket.on("member_joined", (member) => {
        setMembers((prev) => {
          const exists = prev.find((m) => m.userId === member.userId);
          if (exists) return prev;
          return [...prev, { ...member, latitude: null, longitude: null }];
        });
      });

      socket.on("member_location", (data) => {
        setMembers((prev) =>
          prev.map((m) =>
            m.userId === data.userId
              ? { ...m, latitude: data.latitude, longitude: data.longitude }
              : m,
          ),
        );
      });

      socket.on("member_left", (data) => {
        setMembers((prev) => prev.filter((m) => m.userId !== data.userId));
      });

      socket.on("safety_alert_received", (data) => {
        // Also show an Alert popup
        Alert.alert(`🚨 SOS from ${data.name}`, data.message, [{ text: "OK" }]);
      });

      socket.on("disconnect", () => {
        setConnected(false);
      });
    } catch (error) {
      Alert.alert("Connection Error", error.message);
    }
  }, [room, user]);

  const startLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Location access is needed for tracking.",
      );
      return;
    }

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        setMyLocation({ latitude, longitude });

        const socket = getSocket();
        if (socket && socket.connected && room?.code) {
          socket.emit("location_update", {
            roomCode: room.code,
            latitude,
            longitude,
          });
        }
      },
    );
  }, [room]);

  useEffect(() => {
    setupSocket();
    startLocation();

    return () => {
      cleanup();
    };
  }, [cleanup, setupSocket, startLocation]);

  function handleLeaveRoom() {
  Alert.alert(
    "Leave Room",
    user?.id === room?.host
      ? "You are the host. Leaving will end the room for everyone."
      : "Are you sure you want to leave this ride?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          // If host, end the room in DB
          if (user?.id === room?.host) {
            try {
              await endRoom(room.id || room._id);
            } catch (e) {
              console.log("End room error:", e.message);
            }
          }
          cleanup();
          navigation.replace("MainTabs");
        },
      },
    ]
  );
}

  const mapMembers = members
    .filter((m) => m.latitude && m.longitude)
    .map((m) => ({
      name: m.name,
      latitude: m.latitude,
      longitude: m.longitude,
    }));

  return (
    <SafeAreaView style={s.root}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* ── Top Bar ── */}
      <View style={s.topBar}>
        <View>
          <Text style={s.roomName}>
            {room?.icon} {room?.name}
          </Text>
          <Text style={s.roomCode}>{room?.code}</Text>
        </View>
        <View style={s.topBarRight}>
          <View
            style={[
              s.dot,
              { backgroundColor: connected ? "#4CAF50" : colors.border },
            ]}
          />
          <Text style={s.connectedText}>
            {connected ? "Live" : "Connecting..."}
          </Text>
          <TouchableOpacity style={s.leaveBtn} onPress={handleLeaveRoom}>
            <Text style={s.leaveBtnText}>Leave</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Map ── */}
      <View style={s.mapContainer}>
        {myLocation ? (
          <WebView
            source={{
              html: getLeafletHTML(
                myLocation.latitude,
                myLocation.longitude,
                mapMembers,
              ),
            }}
            style={s.map}
            scrollEnabled={false}
          />
        ) : (
          <View style={s.mapPlaceholder}>
            <Text style={s.mapPlaceholderText}>
              📍 Getting your location...
            </Text>
          </View>
        )}
      </View>

      {/* ── Members List ── */}
      <View style={s.membersPanel}>
        <Text style={s.membersTitle}>Riders ({members.length + 1})</Text>
        <FlatList
          data={[
            {
              userId: user?.id,
              name: `${user?.name} (You)`,
              avatar: user?.avatar,
              latitude: myLocation?.latitude,
              longitude: myLocation?.longitude,
            },
            ...members,
          ]}
          keyExtractor={(item) => item.userId?.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.memberChip}
              onPress={() => {
                if (item.userId !== user?.id) {
                  navigation.navigate("MemberDetail", { member: item });
                }
              }}
            >
              <Text style={s.memberAvatar}>{item.avatar || "🧍"}</Text>
              <Text style={s.memberName} numberOfLines={1}>
                {item.name}
              </Text>
              <View
                style={[
                  s.memberDot,
                  {
                    backgroundColor: item.latitude ? "#4CAF50" : colors.border,
                  },
                ]}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ── SOS Button ── */}
      <TouchableOpacity
        style={s.sosBtn}
        onPress={() => navigation.navigate("SafetyAlert", { room, myLocation })}
      >
        <Text style={s.sosBtnText}>🚨 SOS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    roomName: {
      fontSize: FONTSIZE.md,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
    },
    roomCode: {
      fontSize: FONTSIZE.xs,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
      marginTop: 2,
    },
    topBarRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    connectedText: {
      fontSize: FONTSIZE.xs,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
    },
    leaveBtn: {
      backgroundColor: colors.inputBg,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    leaveBtnText: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.medium,
      color: colors.textPrimary,
    },
    mapContainer: {
      flex: 1,
    },
    map: { flex: 1 },
    mapPlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.inputBg,
    },
    mapPlaceholderText: {
      fontSize: FONTSIZE.md,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
    },
    membersPanel: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    membersTitle: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
      marginBottom: SPACING.sm,
    },
    memberChip: {
      alignItems: "center",
      backgroundColor: colors.inputBg,
      borderRadius: RADIUS.md,
      padding: SPACING.sm,
      marginRight: SPACING.sm,
      minWidth: 64,
      borderWidth: 1,
      borderColor: colors.border,
    },
    memberAvatar: { fontSize: 22 },
    memberName: {
      fontSize: FONTSIZE.xs,
      fontFamily: FONTS.regular,
      color: colors.textPrimary,
      marginTop: 4,
      maxWidth: 60,
      textAlign: "center",
    },
    memberDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 4,
    },
    sosBtn: {
      backgroundColor: "#E53935",
      margin: SPACING.lg,
      borderRadius: RADIUS.lg,
      paddingVertical: SPACING.md,
      alignItems: "center",
      ...SHADOW.md,
    },
    sosBtnText: {
      fontSize: FONTSIZE.lg,
      fontFamily: FONTS.bold,
      color: "#fff",
    },
  });
