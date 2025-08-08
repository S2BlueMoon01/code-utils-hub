# Storage Manager

## Tính năng

Storage Manager giúp bạn quản lý localStorage của ứng dụng playground một cách hiệu quả:

### 🎯 Chức năng chính

1. **Theo dõi dung lượng storage**
   - Hiển thị dung lượng đã sử dụng
   - Phần trăm sử dụng và dung lượng còn lại
   - Thống kê chi tiết các loại dữ liệu

2. **Quản lý dữ liệu**
   - **Playground Code**: Code được share từ generator (expire sau 30 phút)
   - **Persisted Code**: Code được lưu lâu dài (expire sau 24 giờ)
   - **Other Data**: Các dữ liệu khác trong localStorage

3. **Dọn dẹp tự động**
   - Auto cleanup khi app khởi động
   - Xóa entries đã expired
   - Xóa entries cũ hơn 7 ngày

### 🛠️ Các thao tác cleanup

- **Clean Expired**: Xóa entries đã hết hạn
- **Clean Old**: Xóa entries cũ hơn 7 ngày  
- **Clear All Storage**: Xóa toàn bộ playground storage
- **Refresh**: Cập nhật dữ liệu mới nhất

### 📊 Thống kê hiển thị

- Tổng số entries
- Số lượng playground entries
- Số lượng persisted entries  
- Số lượng expired entries
- Thời gian tạo entry cũ nhất/mới nhất

## Cách sử dụng

### Truy cập Storage Manager
Vào `/storage` hoặc click link "Storage" trong navigation menu.

### API Functions

```typescript
import { 
  getStorageStats, 
  getStorageUsage,
  cleanupExpiredEntries,
  cleanupOldEntries, 
  clearAllPlaygroundStorage 
} from '@/lib/storage-manager'

// Lấy thống kê storage
const stats = getStorageStats()

// Lấy thông tin dung lượng
const usage = getStorageUsage()

// Dọn dẹp entries expired
const cleanedExpired = cleanupExpiredEntries()

// Dọn dẹp entries cũ (default: 7 ngày)
const cleanedOld = cleanupOldEntries()

// Xóa toàn bộ playground storage
const totalRemoved = clearAllPlaygroundStorage()
```

### Auto Cleanup

Auto cleanup sẽ chạy tự động khi:
- App khởi động (sau 1 giây)
- Import playground-storage module

## Cấu hình

### Thời gian expire
- **Playground Code**: 30 phút
- **Persisted Code**: 24 giờ  
- **Old Entries Cleanup**: 7 ngày (có thể config)

### Storage Limit
- Giả định limit: 5MB (standard localStorage limit)
- Hiển thị warning khi > 80%

## Best Practices

1. **Thường xuyên cleanup**
   - Chạy cleanup expired entries hàng ngày
   - Cleanup old entries hàng tuần

2. **Monitor storage usage**
   - Kiểm tra % sử dụng định kỳ
   - Alert user khi gần hết dung lượng

3. **Graceful degradation**
   - App vẫn hoạt động nếu localStorage full
   - Fallback khi localStorage không available

## Troubleshooting

### localStorage Full
1. Chạy "Clean Expired" 
2. Chạy "Clean Old" với thời gian ngắn hơn
3. "Clear All Storage" nếu cần thiết

### Performance Issues
- Storage manager chỉ scan localStorage khi cần
- Sử dụng setTimeout để avoid blocking UI
- Batch operations để giảm DOM manipulation

### Browser Compatibility
- Graceful handling khi localStorage không available
- Feature detection cho all storage operations
- Fallback cho older browsers
