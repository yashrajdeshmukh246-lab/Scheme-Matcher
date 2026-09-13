import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { matchSchemes } from "./src/api";

const STATES = [
  "Any", "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"
];

export default function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    category: "General",
    annualIncome: "",
    businessType: "Service",
    state: "Any",
    hasDisability: false,
    isMinority: false
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await matchSchemes(form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Scheme Setu</Text>
        <Text style={styles.subtitle}>
          Find the government schemes you're actually eligible for
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(v) => update("name", v)}
            placeholder="e.g. Priya Sharma"
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={form.age}
            onChangeText={(v) => update("age", v)}
            keyboardType="numeric"
            placeholder="e.g. 28"
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.gender} onValueChange={(v) => update("gender", v)}>
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.category} onValueChange={(v) => update("category", v)}>
              <Picker.Item label="General" value="General" />
              <Picker.Item label="OBC" value="OBC" />
              <Picker.Item label="SC" value="SC" />
              <Picker.Item label="ST" value="ST" />
              <Picker.Item label="EWS" value="EWS" />
            </Picker>
          </View>

          <Text style={styles.label}>Annual Income (Rs.)</Text>
          <TextInput
            style={styles.input}
            value={form.annualIncome}
            onChangeText={(v) => update("annualIncome", v)}
            keyboardType="numeric"
            placeholder="e.g. 180000"
          />

          <Text style={styles.label}>Business Type</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.businessType} onValueChange={(v) => update("businessType", v)}>
              <Picker.Item label="Manufacturing" value="Manufacturing" />
              <Picker.Item label="Service" value="Service" />
              <Picker.Item label="Trading" value="Trading" />
              <Picker.Item label="Agriculture" value="Agriculture" />
            </Picker>
          </View>

          <Text style={styles.label}>State</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.state} onValueChange={(v) => update("state", v)}>
              {STATES.map((s) => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Person with disability</Text>
            <Switch
              value={form.hasDisability}
              onValueChange={(v) => update("hasDisability", v)}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Notified minority community</Text>
            <Switch value={form.isMinority} onValueChange={(v) => update("isMinority", v)} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Find My Schemes</Text>
            )}
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {result && (
          <View>
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                Eligible for {result.eligibleCount} out of {result.totalSchemesChecked} schemes
              </Text>
            </View>

            {result.eligibleSchemes.map((scheme) => (
              <View key={scheme.id} style={styles.schemeCard}>
                <Text style={styles.schemeName}>{scheme.name}</Text>
                <Text style={styles.ministry}>{scheme.ministry}</Text>
                <Text style={styles.desc}>{scheme.description}</Text>
                <Text style={styles.benefit}>Benefit: {scheme.benefits}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(scheme.applyLink)}>
                  <Text style={styles.link}>Apply / Learn more &rarr;</Text>
                </TouchableOpacity>
              </View>
            ))}

            {result.eligibleSchemes.length === 0 && (
              <Text style={styles.noMatch}>
                No schemes matched this profile in our demo database.
              </Text>
            )}
          </View>
        )}

        <Text style={styles.footer}>SIH26092 — AI-Driven Scheme Matching</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f6f8" },
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: "#0b5e59", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#555", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14
  },
  pickerWrap: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12
  },
  button: {
    backgroundColor: "#0b5e59",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 20
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  error: { color: "#c0392b", marginTop: 10 },
  summary: {
    backgroundColor: "#0b5e59",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12
  },
  summaryText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  schemeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#0b5e59"
  },
  schemeName: { fontSize: 15, fontWeight: "700" },
  ministry: { fontSize: 11, color: "#777", marginBottom: 6 },
  desc: { fontSize: 13, color: "#333", marginBottom: 6 },
  benefit: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  link: { color: "#0b5e59", fontWeight: "700" },
  noMatch: { textAlign: "center", color: "#777", marginTop: 10 },
  footer: { textAlign: "center", color: "#999", fontSize: 12, marginTop: 20 }
});
