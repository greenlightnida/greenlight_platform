# 🌐 Multi-Platform Workflow Guide

## 🎯 **Method 1: Multi-Root Workspace (Recommended)**

### **What You Just Did:**
- Created `Greenlight_MultiPlatform_Workspace.code-workspace` 
- Opened it with Cursor
- Now you have both platforms visible in the sidebar!

### **How to Use:**
1. **Switch between platforms**: Click on the folder names in the sidebar
   - 🌐 Greenlight Platform (main platform)
   - ⚽ Top Bins Platform (sports coaching)
   - 📚 Documentation (shared docs)
   - 🧪 Tests (all test files)

2. **Search across all platforms**: Use `Cmd+Shift+F` to search everything

3. **Terminal per platform**: Each folder can have its own terminal

---

## 🚀 **Method 2: Multiple Windows**

### **Option A: New Window for Each Platform**
```bash
# Open Greenlight in current window
# Then open Top Bins in new window:
cursor /Users/home/Developer/Top_Bins/top-bins-platform

# Or open both in separate windows:
cursor .  # Current directory (Greenlight)
cursor top-bins-platform  # Top Bins
```

### **Option B: Split Screen**
- Drag the Cursor window to one side
- Open a new Cursor window for the other platform
- Arrange them side by side

---

## 🎨 **Method 3: Quick Platform Switching**

### **Using File Explorer:**
1. **Current**: You're in the main Greenlight workspace
2. **Switch to Top Bins**: 
   - Navigate to `top-bins-platform/` folder in sidebar
   - Or use `Cmd+P` and type `top-bins-platform`

### **Using Command Palette:**
- `Cmd+Shift+P` → "File: Open Folder" → Select platform

---

## 🔧 **Platform-Specific Commands**

### **Greenlight Platform (Main):**
```bash
npm run launch    # Launch protocol
npm run wrap      # Wrap protocol
npm run anchor    # Anchor command
```

### **Top Bins Platform:**
```bash
cd top-bins-platform
npm run dev       # Start Top Bins dev server
npm run build     # Build Top Bins
```

---

## 📋 **Best Practices**

### **1. Use the Workspace (Method 1)**
- ✅ **Best for**: Most development work
- ✅ **Benefits**: Everything in one place, easy switching
- ✅ **Perfect for**: When working on both platforms

### **2. Use Separate Windows (Method 2)**
- ✅ **Best for**: Focused work on one platform
- ✅ **Benefits**: Full screen, no distractions
- ✅ **Perfect for**: Deep debugging or feature development

### **3. Quick Switching (Method 3)**
- ✅ **Best for**: Quick reference or file editing
- ✅ **Benefits**: Fast, no workspace setup needed
- ✅ **Perfect for**: Quick fixes or consultations

---

## 🎯 **Current Setup Summary**

You now have:
- ✅ **Multi-root workspace** with both platforms
- ✅ **Organized documentation** in `docs/`
- ✅ **Centralized tests** in `tests/`
- ✅ **Clean root directory** with essential files only

### **Next Steps:**
1. **Explore the workspace**: Click through the different folders
2. **Try platform switching**: Use the sidebar to navigate
3. **Test search**: Search across all platforms with `Cmd+Shift+F`
4. **Run commands**: Use the integrated terminal for each platform

---

## 🆘 **Troubleshooting**

### **If workspace doesn't open:**
```bash
# Try opening manually:
cursor Greenlight_MultiPlatform_Workspace.code-workspace
```

### **If you get lost:**
- Use `Cmd+Shift+P` → "File: Open Recent"
- Or close all windows and reopen the workspace

### **If you want to go back to single platform:**
- File → Open Folder → Select the platform you want
- Or just close the workspace and open individual folders
- Or reopen workspace: `cursor Greenlight_MultiPlatform_Workspace.code-workspace`

---

## 🎉 **You're All Set!**

You now have the power to work with both platforms simultaneously! The workspace approach gives you the best of both worlds - organized separation with easy access to everything. 