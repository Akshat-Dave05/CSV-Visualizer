// Sample datasets for instant demonstration of CSV Visualizer

export const SAMPLE_DATASETS = [
  {
    id: 'sales_2026',
    name: 'Sales & Revenue Data (2026)',
    filename: 'sales_revenue_2026.csv',
    description: 'Quarterly sales figures, product categories, expenses, and regional units.',
    csv: `Date,Product,Category,Sales,Expenses,Profit,Region,Units
2026-01-01,Laptop,Electronics,120000,80000,40000,North,120
2026-01-02,Phone,Electronics,95000,60000,35000,South,190
2026-01-03,Chair,Furniture,45000,28000,17000,East,150
2026-01-04,Desk,Furniture,60000,35000,25000,West,80
2026-01-05,Monitor,Electronics,70000,42000,28000,North,140
2026-01-06,Headphones,Electronics,35000,18000,17000,South,230
2026-01-07,Bookshelf,Furniture,50000,32000,18000,East,65
2026-01-08,Tablet,Electronics,85000,52000,33000,West,110
2026-01-09,Sofa,Furniture,110000,75000,35000,North,45
2026-01-10,Keyboard,Electronics,28000,14000,14000,South,280
2026-01-11,Mouse,Electronics,22000,10000,12000,East,310
2026-01-12,Lamp,Furniture,30000,18000,12000,West,95`
  },
  {
    id: 'hr_analytics',
    name: 'Employee HR Analytics',
    filename: 'employee_hr_analytics.csv',
    description: 'Departmental salaries, experience years, and performance rating metrics.',
    csv: `Employee_ID,Name,Department,Salary,Experience_Years,Performance_Score,Projects_Completed
EMP-101,Sarah Jenkins,Engineering,135000,6,4.8,14
EMP-102,Michael Chang,Marketing,92000,4,4.2,9
EMP-103,Elena Rostova,Engineering,148000,8,4.9,18
EMP-104,David Miller,Sales,105000,5,4.0,12
EMP-105,Priya Sharma,Product,128000,7,4.6,15
EMP-106,James Wilson,HR,85000,3,3.9,7
EMP-107,Anita Patel,Engineering,155000,9,5.0,21
EMP-108,Robert Taylor,Sales,112000,6,4.3,13
EMP-109,Sophia Martinez,Marketing,98000,4,4.5,10
EMP-110,Alex Chen,Product,132000,6,4.7,16`
  },
  {
    id: 'ecommerce_orders',
    name: 'E-Commerce Order Summary',
    filename: 'ecommerce_orders.csv',
    description: 'Order values, customer discounts, shipping costs, and order status.',
    csv: `Order_ID,Category,Customer_Type,Order_Value,Discount,Shipping_Cost,Delivery_Days
ORD-9001,Electronics,VIP,340,35,12,2
ORD-9002,Apparel,Regular,85,5,6,4
ORD-9003,Home & Kitchen,VIP,210,20,9,3
ORD-9004,Electronics,Regular,520,40,15,2
ORD-9005,Beauty,New,65,0,5,5
ORD-9006,Apparel,VIP,175,15,8,3
ORD-9007,Home & Kitchen,Regular,130,10,7,4
ORD-9008,Electronics,VIP,890,75,18,1
ORD-9009,Beauty,Regular,110,10,6,3
ORD-9010,Apparel,New,95,0,6,4`
  }
];
