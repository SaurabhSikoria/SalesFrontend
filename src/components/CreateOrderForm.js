import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  useDisclosure,
  Box,
  Flex,
  Spacer,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorMode,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { createSalesOrder, fetchProducts } from '../api/servicecalls';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Select as ChakraReactSelect } from 'chakra-react-select';
import makeAnimated from 'react-select/animated';

const CreateOrderForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { control, handleSubmit, reset, setValue } = useForm();
  const [selectedProducts, setSelectedProducts] = useState([]);

  const colorMode = useColorMode();
  const animatedComponents = makeAnimated();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const {
    mutate,
    isSuccess,
    reset: resetForm,
  } = useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      setTimeout(() => {
        resetForm();
      }, 3000);
    },
  });

  const handleProductChange = selectedOptions => {
    const selectedProductIds = selectedOptions.map(option => option.value);
    const selectedProductData = products.filter(product =>
      selectedProductIds.includes(product.id)
    );
    setSelectedProducts(selectedProductData);
    setValue('product', selectedOptions);
  };

  const orderFormSubmit = data => {
    const { product, ...orderData } = data;
    const sortedItems = orderData.items[0].filter(
      item => item.quantity !== '' && item.price !== ''
    );
    orderData.items = sortedItems;
    orderData.invoice_date = new Date().toISOString().split('T')[0];
    mutate(orderData);
    reset();
    setSelectedProducts([]);
    onClose();
  };

  const options = products.map(product => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <>
      <Button onClick={onOpen}>Create Order</Button>
      {isSuccess && (
        <Alert
          status="success"
          variant={'left-accent'}
          position={'absolute'}
          top={5}
          right={'30%'}
          width={'30%'}
        >
          <AlertIcon />
          Your Sales Order Have Been Placed!
        </Alert>
      )}
      <Modal isOpen={isOpen} size={'xl'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(orderFormSubmit)}>
              <FormControl mb={6}>
                <FormLabel>Customer ID</FormLabel>
                <Controller
                  name="customer_id"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Customer ID" />
                  )}
                />
              </FormControl>

              <ChakraReactSelect
                options={options}
                components={animatedComponents}
                isMulti
                onChange={handleProductChange}
                chakraStyles={{
                  control: provided => ({
                    ...provided,
                    backgroundColor: colorMode === 'dark' ? '#2D3748' : '#fff',
                  }),
                  menu: provided => ({
                    ...provided,
                    backgroundColor: colorMode === 'dark' ? '#2D3748' : '#fff',
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? colorMode === 'dark'
                        ? '#4A5568'
                        : '#BEE3F8'
                      : state.isFocused
                      ? colorMode === 'dark'
                        ? '#2A4365'
                        : '#E2E8F0'
                      : undefined,
                    color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
                  }),
                }}
              />

              {selectedProducts.length !== 0 && (
                <Accordion defaultIndex={[0]} allowToggle>
                  {selectedProducts.map((product, productIndex) => (
                    <AccordionItem key={product.id}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            {product.name}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {product.sku.map((sku, skuIndex) => (
                          <Box
                            position={'relative'}
                            key={sku.id}
                            mb={4}
                            borderWidth="1px"
                            borderRadius="md"
                            p={4}
                          >
                            <FormControl mb={2} display="none">
                              <FormLabel>Sku ID</FormLabel>
                              <Controller
                                name={`items[${productIndex}][${skuIndex}].sku_id`}
                                control={control}
                                defaultValue={sku.id}
                                render={({ field }) => (
                                  <Input {...field} type="hidden" />
                                )}
                              />
                            </FormControl>
                            <FormControl mb={2}>
                              <FormLabel>
                                <Flex>
                                  <Box>
                                    {skuIndex + 1}. SKU {sku.id} {sku.amount}
                                    {sku.unit}
                                  </Box>
                                  <Spacer />
                                  <Box>(Rate: ₹{sku.max_retail_price})</Box>
                                </Flex>
                              </FormLabel>
                            </FormControl>

                            <Flex mb={3}>
                              <FormControl mb={2} mr={2}>
                                <FormLabel>Selling Rate</FormLabel>
                                <Controller
                                  name={`items[${productIndex}][${skuIndex}].price`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <NumberInput {...field}>
                                      <NumberInputField />
                                    </NumberInput>
                                  )}
                                />
                              </FormControl>

                              <FormControl mb={2} ml={2}>
                                <FormLabel>Quantity</FormLabel>
                                <Controller
                                  name={`items[${productIndex}][${skuIndex}].quantity`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <NumberInput {...field} min={1}>
                                      <NumberInputField />
                                    </NumberInput>
                                  )}
                                />
                              </FormControl>
                            </Flex>
                            <Box position="absolute" bottom={1} right={2}>
                              <Text
                                as={'b'}
                                color="green.900"
                                bg="green.300"
                                py={0.4}
                                px={1.5}
                                borderRadius="xl"
                              >
                                {sku.quantity_in_inventory} Items Remaining
                              </Text>
                            </Box>
                          </Box>
                        ))}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              <FormControl my={4}>
                <FormLabel>Invoice No</FormLabel>
                <Controller
                  name="invoice_no"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Invoice Number" />
                  )}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Paid</FormLabel>
                <Controller
                  name="paid"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Select>
                  )}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" mr={3}>
                Submit
              </Button>
              <Button onClick={onClose} my={3}>
                Cancel
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateOrderForm;
