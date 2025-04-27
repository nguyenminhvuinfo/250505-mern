import React, { useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Table, Thead, Tbody, Tr, Th, Td,
  Spinner, Alert, AlertIcon
} from '@chakra-ui/react';

const AuditLogs = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) fetchAuditLogs();
  }, [isOpen]);

  const fetchAuditLogs = async () => {
    setIsLoading(true); setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không có token, vui lòng đăng nhập.");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auditlogs', {
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      } else {
        setError("Không thể lấy nhật ký.");
      }
    } catch {
      setError("Lỗi kết nối với server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị tên sản phẩm tại thời điểm thay đổi
  const getProductName = (log) => {
    // Nếu action là DELETE, hiển thị tên cũ từ oldData
    if (log.action === 'DELETE') {
      return log.changes?.old?.name || "Sản phẩm không tồn tại hoặc đã bị xóa";
    }

    // Trường hợp UPDATE hoặc CREATE, hiển thị tên sản phẩm mới nhất từ newData
    if (log.action === 'UPDATE' || log.action === 'CREATE') {
      return log.changes?.new?.name || log.product || "Không xác định";
    }

    return "Không xác định";
  };

  // Lấy thông tin thay đổi từ note hoặc từ product
  const extractChangeInfo = (log, field) => {
    const oldValue = log.changes?.old?.[field];
    const newValue = log.changes?.new?.[field];
    return oldValue && newValue ? { old: oldValue, new: newValue } : null;
  };

  // Render nội dung chi tiết với thông tin thay đổi
  const renderDetailContent = (log) => {
    if (log.action === 'UPDATE') {
      const nameChange = extractChangeInfo(log, 'name');
      const priceChange = extractChangeInfo(log, 'price');
      const imageChange = extractChangeInfo(log, 'image');

      return (
        <>
          {nameChange && (
            <div>
              <strong>Tên sản phẩm:</strong> {nameChange.old} → {nameChange.new}
            </div>
          )}
          {priceChange && (
            <div>
              <strong>Giá tiền:</strong> {priceChange.old} → {priceChange.new}
            </div>
          )}
          {imageChange && (
            <div>
              <strong>Hình ảnh:</strong> {imageChange.old} → {imageChange.new}
            </div>
          )}
        </>
      );
    }

    // CREATE / DELETE: show full info
    return (
      <>
        <div><strong>Tên sản phẩm:</strong> {log.changes?.new?.name || log.changes?.old?.name || "Không xác định"}</div>
        <div><strong>Giá tiền:</strong> {log.changes?.new?.price || log.changes?.old?.price}</div>
        <div><strong>Link ảnh:</strong> {log.changes?.new?.image || log.changes?.old?.image}</div>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="90%">
        <ModalHeader textAlign="center">Nhật ký chỉnh sửa</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Spinner size="xl" />
          ) : error ? (
            <Alert status="error"><AlertIcon />{error}</Alert>
          ) : (
            <Table variant="simple" colorScheme="blue" w="100%" overflow="hidden">
              <Thead>
                <Tr>
                  <Th width="15%" >Phương thức</Th>
                  <Th width="15%">User</Th>
                  <Th width="25%">Sản phẩm</Th>
                  <Th width="45%" textAlign="center">Nội dung chi tiết</Th>
                </Tr>
              </Thead>
              <Tbody>
                {logs.length ? logs.map((log) => (
                  <Tr key={log.timestamp}>
                    <Td color={log.action === 'CREATE' ? 'green.400' : log.action === 'UPDATE' ? 'blue.400' : 'red.400'}>
                      {log.action === 'CREATE' ? 'THÊM MỚI' :
                       log.action === 'UPDATE' ? 'CHỈNH SỬA' :
                       'XÓA BỎ'}
                    </Td>
                    <Td style={{ wordWrap: 'break-word', maxWidth: '15%' }}>{log.user}</Td>
                    <Td style={{ wordWrap: 'break-word', maxWidth: '25%' }}>{getProductName(log)}</Td>
                    <Td style={{ wordWrap: 'break-word', maxWidth: '50%' }}>{renderDetailContent(log)}</Td>
                  </Tr>
                )) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center">Không có nhật ký nào.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuditLogs;
