import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { MdMoreHoriz } from 'react-icons/md';
import CreateOrderForm from './components/CreateOrderForm';
import EditOrderForm from './components/EditOrderForm';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  editSalesOrder,
  fetchCustomers,
  fetchSaleOrders,
} from './api/servicecalls';
import ViewCompletedSales from './components/ViewCompletedSales';

const App = () => {
  const navigate = useNavigate();
  const [formSuccess, setFormSuccess] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    isOpen: isEditFormOpen,
    onOpen: openEditForm,
    onClose: closeEditForm,
  } = useDisclosure();
  const {
    isOpen: isViewSalesOpen,
    onOpen: openViewSales,
    onClose: closeViewSales,
  } = useDisclosure();
  const [activeSales, setActiveSales] = useState([]);
  const [completedSales, setCompletedSales] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const { data: dataSaleOrders, refetch } = useQuery({
    queryKey: ['sale_Orders'],
    queryFn: fetchSaleOrders,
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const { mutate } = useMutation({
    mutationFn: editSalesOrder,
    onSuccess: () => {
      console.log('Form Edited');
      refetch();
    },
  });

  useEffect(() => {
    if (customersData && dataSaleOrders) {
      const calculateTotal = order => {
        return order.items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      };

      const salesOrders = dataSaleOrders.map(order => {
        const customer = customersData.find(customer => {
          if (typeof order.customer_id !== 'number') {
            order.customer_id = parseInt(order.customer_id);
          }
          return customer.customer === order.customer_id;
        });
        const totalPrice = calculateTotal(order);
        return {
          ...order,
          customerName: customer
            ? customer.customer_profile.name
            : 'Unknown Customer',
          total_price: totalPrice,
        };
      });

      setActiveSales(salesOrders.filter(order => !order.paid));
      setCompletedSales(salesOrders.filter(order => order.paid));
    }
  }, [customersData, dataSaleOrders]);

  const handleTabsChange = index => {
    setTabIndex(index);
  };

  const onEditOrder = order => {
    setSelectedOrder(order);
    openEditForm();
  };

  const onCheckOrder = order => {
    setSelectedOrder(order);
    openViewSales();
  };

  const handleEditFormSubmit = data => {
    data.invoice_date = new Date().toISOString().split('T')[0];
    mutate(data);
    closeEditForm();
    setFormSuccess(prev => prev + 1);
  };

  return (
    <Box p={5} m={5}>
      <Flex justifyContent="space-between" mb={4}>
        <Tabs variant="enclosed" index={tabIndex} onChange={handleTabsChange}>
          <TabList>
            <Tab>Active Sales</Tab>
            <Tab>Completed Sales</Tab>
          </TabList>
        </Tabs>
        <Flex alignItems="center">
          <CreateOrderForm refetch={refetch} />
          <ColorModeSwitcher justifySelf="flex-end" />
        </Flex>
      </Flex>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Tabs index={tabIndex}>
          <TabPanels>
            <TabPanel>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Customer Name</Th>
                    <Th>Price</Th>
                    <Th>Last Modified</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {activeSales &&
                    activeSales.map(order => {
                      return (
                        <Tr key={order.id}>
                          <Td>{order.customer_id}</Td>
                          <Td>{order.customerName}</Td>
                          <Td>${order.total_price}</Td>
                          <Td>{order.invoice_date}</Td>
                          <Td>
                            <IconButton
                              size="md"
                              fontSize="lg"
                              variant="ghost"
                              aria-label="Edit"
                              onClick={() => onEditOrder(order)}
                              icon={<MdMoreHoriz />}
                            />
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Customer Name</Th>
                    <Th>Price</Th>
                    <Th>Last Modified</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {completedSales &&
                    completedSales.map(order => (
                      <Tr key={order.id}>
                        <Td>{order.customer_id}</Td>
                        <Td>{order.customerName}</Td>
                        <Td>${order.total_price}</Td>
                        <Td>{order.invoice_date}</Td>
                        <Td>
                          <IconButton
                            size="md"
                            fontSize="lg"
                            variant="ghost"
                            aria-label="Edit"
                            onClick={() => onCheckOrder(order)}
                            icon={<MdMoreHoriz />}
                          />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <EditOrderForm
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        order={selectedOrder}
        onSubmit={handleEditFormSubmit}
        key={formSuccess}
      />
      <ViewCompletedSales
        isOpen={isViewSalesOpen}
        onClose={closeViewSales}
        order={selectedOrder}
      />
    </Box>
  );
};

export default App;
