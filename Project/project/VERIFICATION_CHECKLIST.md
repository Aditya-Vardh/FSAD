# SettleUp - Verification Checklist

Use this checklist to verify all features are working correctly before your demo/viva.

## Setup Verification

- [ ] MongoDB is installed and running
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend `.env` file created with correct values
- [ ] Backend server starts without errors (`npm start` in backend/)
- [ ] Frontend server starts without errors (`npm run dev`)
- [ ] Can access `http://localhost:5173` in browser
- [ ] No console errors on page load

## Authentication Features

- [ ] Registration page loads correctly
- [ ] Can register a new user with valid data
- [ ] Registration shows error for invalid email
- [ ] Registration shows error for password < 6 characters
- [ ] Registration shows error for duplicate email
- [ ] After registration, user is logged in and redirected to dashboard
- [ ] Login page loads correctly
- [ ] Can login with valid credentials
- [ ] Login shows error for invalid credentials
- [ ] After login, user is redirected to dashboard
- [ ] Logout button works and redirects to login
- [ ] Protected routes redirect to login when not authenticated

## Dashboard Features

- [ ] Dashboard loads after login
- [ ] Shows "Total Owed" card with claymorphism
- [ ] Shows "To Receive" card with claymorphism
- [ ] Shows "Net Balance" card with claymorphism
- [ ] Cards display correct values (0.00 if no data)
- [ ] Groups section shows all user's groups
- [ ] Groups section shows "No groups yet" message if empty
- [ ] "Manage Groups" button works
- [ ] Can navigate to group details from dashboard
- [ ] Dashboard is responsive on mobile

## Groups Features

- [ ] Groups page loads correctly
- [ ] "Create Group" button has claymorphism effect
- [ ] Create group modal opens
- [ ] Can create a group with name and description
- [ ] Created group appears in the list
- [ ] Can edit a group
- [ ] Can delete a group (only creator can delete)
- [ ] Group cards show member count
- [ ] "View Details" button navigates to group detail page
- [ ] Groups page is responsive

## Group Detail Features

- [ ] Group detail page loads correctly
- [ ] Shows group name and description
- [ ] "Add Expense" button has claymorphism effect
- [ ] "Settle Up" button has claymorphism effect
- [ ] Balance summary cards show with claymorphism
- [ ] Balances table displays correctly
- [ ] Expenses list displays correctly
- [ ] Shows "No expenses yet" message if empty

## Expense Features

- [ ] "Add Expense" modal opens
- [ ] Can enter expense description
- [ ] Can enter expense amount
- [ ] Can select who paid
- [ ] Can choose split type (equal/custom)
- [ ] Equal split works correctly
- [ ] Custom split shows input fields for each member
- [ ] Can add expense with equal split
- [ ] Can add expense with custom split
- [ ] Expense appears in the list after adding
- [ ] Expense shows correct split information
- [ ] Can delete an expense
- [ ] Balances update after adding expense
- [ ] Balances update after deleting expense
- [ ] Input validation works (amount > 0, required fields)

## Settlement Features

- [ ] "Settle Up" modal opens
- [ ] Can select person to pay
- [ ] Can enter settlement amount
- [ ] Can submit settlement
- [ ] Settlement updates balances correctly
- [ ] Balances reflect after settlement
- [ ] Can only settle debts you owe (validation works)

## UI/UX Verification

- [ ] Claymorphism applied to primary buttons
- [ ] Claymorphism applied to dashboard cards
- [ ] Input fields use Material Design (no claymorphism)
- [ ] Tables use clean design (no claymorphism)
- [ ] Navbar is simple and flat (no claymorphism)
- [ ] Color scheme is consistent
- [ ] All text is readable
- [ ] Buttons have hover effects
- [ ] Forms show validation errors
- [ ] Success messages display (if implemented)
- [ ] Error messages are user-friendly
- [ ] Loading states work correctly

## Responsive Design

- [ ] Desktop view (1920x1080) looks good
- [ ] Tablet view (768px) works correctly
- [ ] Mobile view (375px) works correctly
- [ ] Navigation is accessible on mobile
- [ ] Forms are usable on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Modals are responsive
- [ ] Buttons are touch-friendly

## Error Handling

- [ ] Network errors show user-friendly messages
- [ ] Validation errors show specific messages
- [ ] 401 errors redirect to login
- [ ] 404 errors show appropriate messages
- [ ] 500 errors show generic error message
- [ ] No console errors during normal operation
- [ ] No broken routes

## Performance

- [ ] Page loads quickly
- [ ] API calls complete in reasonable time
- [ ] No unnecessary re-renders
- [ ] Smooth transitions and animations
- [ ] No memory leaks (check with browser dev tools)

## Security

- [ ] Passwords are not visible in network requests
- [ ] JWT tokens are stored securely
- [ ] Protected routes require authentication
- [ ] API routes validate authentication
- [ ] Input validation prevents malicious data
- [ ] CORS is configured correctly

## Final Checks

- [ ] All features work end-to-end
- [ ] No placeholder content
- [ ] All buttons are functional
- [ ] Database persists data correctly
- [ ] Can create a complete workflow:
  1. Register → Login → Create Group → Add Expense → View Balances → Settle Payment
- [ ] Ready for demo presentation
- [ ] Documentation is complete

## Demo Flow Test

Test this complete flow:

1. [ ] Register a new account
2. [ ] Login with the account
3. [ ] Create a group
4. [ ] Add an expense with equal split
5. [ ] Add another expense with custom split
6. [ ] View balances (should show who owes what)
7. [ ] Settle a payment
8. [ ] Verify balances updated correctly
9. [ ] Logout
10. [ ] Login again
11. [ ] Verify data persisted (groups, expenses still there)

## Notes

- If any item is unchecked, fix the issue before demo
- Test with multiple users if possible
- Test edge cases (empty groups, zero amounts, etc.)
- Prepare answers for common questions about:
  - Why Claymorphism is used selectively
  - How balances are calculated
  - Database schema design
  - Security measures
  - Future enhancements

---

**Status**: ☐ Ready for Demo  ☐ Needs Fixes

**Issues Found**:
- 
- 
- 
