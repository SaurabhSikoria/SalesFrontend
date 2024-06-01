import React, { useEffect } from 'react';
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
  Box,
  Flex,
  NumberInputField,
  NumberInput,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';

const ViewCompletedSales = ({ isOpen, onClose, order }) => {
  const { control, reset } = useForm();

  useEffect(() => {
    if (order) {
      reset(order);
    }
  }, [order, reset]);

  return (
    <>
      {order && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>View Completed Sale</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form id="view-sale-form">
                <FormControl mb={6}>
                  <FormLabel>Customer ID</FormLabel>
                  <Controller
                    name="customer_id"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} isReadOnly placeholder="Customer ID" />
                    )}
                  />
                </FormControl>

                {order.items &&
                  order.items.map((sku, skuIndex) => (
                    <Box
                      position={'relative'}
                      key={skuIndex}
                      mb={4}
                      borderWidth="1px"
                      borderRadius="md"
                      p={4}
                    >
                      <FormControl mb={2} display="none">
                        <FormLabel>Sku ID</FormLabel>
                        <Controller
                          name={`items[${skuIndex}].sku_id`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} type="hidden" isReadOnly />
                          )}
                        />
                      </FormControl>
                      <Flex mb={3}>
                        <FormControl mb={2} mr={2}>
                          <FormLabel>Selling Rate</FormLabel>
                          <Controller
                            name={`items[${skuIndex}].price`}
                            control={control}
                            render={({ field }) => (
                              <NumberInput {...field} isReadOnly min={1}>
                                <NumberInputField />
                              </NumberInput>
                            )}
                          />
                        </FormControl>

                        <FormControl mb={2} ml={2}>
                          <FormLabel>Quantity</FormLabel>
                          <Controller
                            name={`items[${skuIndex}].quantity`}
                            control={control}
                            render={({ field }) => (
                              <NumberInput {...field} isReadOnly min={1}>
                                <NumberInputField />
                              </NumberInput>
                            )}
                          />
                        </FormControl>
                      </Flex>
                    </Box>
                  ))}

                <FormControl my={4}>
                  <FormLabel>Invoice No</FormLabel>
                  <Controller
                    name="invoice_no"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        isReadOnly
                        placeholder="Invoice Number"
                      />
                    )}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Paid</FormLabel>
                  <Controller
                    name="paid"
                    control={control}
                    render={({ field }) => (
                      <Box mb={4} borderWidth="1px" borderRadius="md" p={4}>
                        Yes
                      </Box>
                    )}
                  />
                </FormControl>

                <Button
                  onClick={onClose}
                  colorScheme="blue"
                  my={3}
                  left={'86%'}
                >
                  Close
                </Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ViewCompletedSales;
