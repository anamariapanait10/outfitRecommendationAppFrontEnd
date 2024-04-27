import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { MarketplaceItem } from '../app/(auth)/marketplace_item_details';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

const MarketplaceItemDetailsTable = (item: MarketplaceItem ) => {
  return (
    <DataTable style={styles.container}>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <Ionicons name="pricetags-outline" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Brand</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{item.brand}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="attach-money" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Price</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{item.price} EUR</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="format-list-bulleted" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Condition</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{item.condition}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="format-size" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Size</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{item.size}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="location-pin" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Location</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{item.location}</DataTable.Cell>
      </DataTable.Row>
      {item.outfit.description &&
        <DataTable.Row>
            <DataTable.Cell>
                <View style={styles.cellIconLayout}>
                    <MaterialIcons name="layers" size={20} style={styles.icon} />
                    <Text style={styles.boldText}>Description</Text>
                </View>
            </DataTable.Cell>
            <DataTable.Cell>{item.outfit.description}</DataTable.Cell>
        </DataTable.Row>
      }
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="layers" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Subcategory</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{item.outfit.subCategory}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="snowing" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Material</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{item.outfit.material}</DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  cellIconLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
});

export default MarketplaceItemDetailsTable;
