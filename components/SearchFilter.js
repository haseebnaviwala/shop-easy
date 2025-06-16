import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';


const categories = ['All', 'Electronics', 'Fashion', 'Books', 'Home'];

const SearchFilter = ({ searchText, setSearchText, products, setFilteredProducts }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none');

  useEffect(() => {
    applyFilters();
  }, [searchText, selectedCategory, sortOrder]);

  const applyFilters = () => {
    let data = [...products];

    // Search
    if (searchText) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      data = data.filter((item) => item.category === selectedCategory);
    }

    // Price Sort
    if (sortOrder === 'low') {
      data.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high') {
      data.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(data);
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchRow}>
        <Icon name="search" size={20} />
        <TextInput
          placeholder="Search..."
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Category Filter */}
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map((cat) => (
          <Picker.Item label={cat} value={cat} key={cat} />
        ))}
      </Picker>

      {/* Sort Options */}
      <Picker
        selectedValue={sortOrder}
        onValueChange={(itemValue) => setSortOrder(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Sort by Price" value="none" />
        <Picker.Item label="Low to High" value="low" />
        <Picker.Item label="High to Low" value="high" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    height: 40,
  },
  picker: {
    height: 45,
    marginVertical: 5,
  },
});

export default SearchFilter;
