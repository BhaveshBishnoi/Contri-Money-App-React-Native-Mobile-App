import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function RootLayout() {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const addMember = () => {
    if (newMemberName) {
      setMembers([...members, {name: newMemberName, totalSpent: 0}]);
      setNewMemberName('');
    }
  };

  const addExpense = () => {
    if (newExpenseAmount && selectedMembers.length > 0 && paidBy) {
      const amount = Number(newExpenseAmount);
      const splitAmount = amount / selectedMembers.length;
      setExpenses([...expenses, {amount, members: selectedMembers, paidBy}]);
      setMembers(
        members.map(member =>
          selectedMembers.includes(member.name)
            ? {...member, totalSpent: member.totalSpent + splitAmount}
            : member,
        ),
      );
      setNewExpenseAmount('');
      setSelectedMembers([]);
      setPaidBy('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Contry Manager</Text>

        {/* Add Member Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter member name"
            value={newMemberName}
            onChangeText={setNewMemberName}
          />
          <Button title="Add Member" onPress={addMember} />
        </View>

        {/* Add Expense Section - Updated */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter expense amount"
            value={newExpenseAmount}
            onChangeText={setNewExpenseAmount}
            keyboardType="numeric"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScrollView}>
            <View style={styles.pickerContainer}>
              {members.map(member => (
                <TouchableOpacity
                  key={member.name}
                  style={[
                    styles.memberButton,
                    paidBy === member.name && styles.memberButtonSelected,
                  ]}
                  onPress={() => setPaidBy(member.name)}>
                  <Text style={[
                    styles.memberButtonText,
                    paidBy === member.name && styles.memberButtonTextSelected
                  ]}>
                    {member.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity 
            style={styles.addExpenseButton}
            onPress={addExpense}>
            <Text style={styles.addExpenseButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Member Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Members to Split Expense</Text>
          {members.map(member => (
            <View key={member.name} style={styles.memberRow}>
              <Text>{member.name}</Text>
              <Switch
                value={selectedMembers.includes(member.name)}
                onValueChange={selected => {
                  setSelectedMembers(
                    selected
                      ? [...selectedMembers, member.name]
                      : selectedMembers.filter(name => name !== member.name),
                  );
                }}
              />
            </View>
          ))}
        </View>

        {/* Expenses Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Name</Text>
              <Text style={styles.tableHeader}>Split Amount</Text>
              <Text style={styles.tableHeader}>Paid Amount</Text>
            </View>
            {members.map(member => {
              const totalPaid = expenses.reduce(
                (acc, expense) =>
                  expense.paidBy === member.name ? acc + expense.amount : acc,
                0,
              );
              const totalSplit = expenses.reduce(
                (acc, expense) =>
                  expense.members.includes(member.name)
                    ? acc + expense.amount / expense.members.length
                    : acc,
                0,
              );

              return (
                <View key={member.name} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{member.name}</Text>
                  <Text style={styles.tableCell}>{totalSplit.toFixed(2)}</Text>
                  <Text style={styles.tableCell}>{totalPaid.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.totalAmount}>
            Total Paid Amount:{' '}
            {expenses
              .reduce((acc, expense) => acc + expense.amount, 0)
              .toFixed(2)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerScrollView: {
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  memberButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  memberButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  memberButtonText: {
    color: '#333',
    fontSize: 14,
  },
  memberButtonTextSelected: {
    color: '#fff',
  },
  addExpenseButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addExpenseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 5,
  },
  tableHeader: {
    flex: 1,
    padding: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f8f8f8',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
  },
  totalAmount: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
