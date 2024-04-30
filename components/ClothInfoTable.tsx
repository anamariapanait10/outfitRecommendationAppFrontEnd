import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ClothingItem } from './cloth_card';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ClothInfoTable = (cloth: ClothingItem) => {
  return (
    <DataTable style={styles.container}>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="shape-line" size={18} style={styles.icon} />
                <Text style={styles.boldText}>Category</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{cloth.category}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="layers" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Subcategory</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{cloth.subCategory}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="sunny" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Seasons</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{cloth.seasons}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="snowing" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Material</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{cloth.material}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="texture" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Pattern</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{cloth.pattern}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="spoke" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Color</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{cloth.color}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell>
            <View style={styles.cellIconLayout}>
                <MaterialIcons name="work" size={20} style={styles.icon} />
                <Text style={styles.boldText}>Occasions</Text>
            </View>
        </DataTable.Cell>
        <DataTable.Cell>{cloth.occasions}</DataTable.Cell>
      </DataTable.Row>
      {cloth.description &&
        <DataTable.Row>
            <DataTable.Cell>
                <View style={styles.cellIconLayout}>
                    <MaterialIcons name="layers" size={20} style={styles.icon} />
                    <Text style={styles.boldText}>Description</Text>
                </View>
            </DataTable.Cell>
            <DataTable.Cell>{cloth.description}</DataTable.Cell>
        </DataTable.Row>
      }
    </DataTable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
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

export default ClothInfoTable;
