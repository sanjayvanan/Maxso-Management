const styles = {
    // Layouts
    appWrapper: "min-h-screen bg-[#0d0d0d] text-gray-300 font-sans flex",
    sidebarContainer: "w-64 bg-gradient-to-b from-[#8b0000] to-[#2b0000] min-h-screen flex flex-col text-white transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20",
    mainContent: "flex-1 flex flex-col min-w-0 transition-all duration-300 bg-[#0d0d0d]",
    pageContainer: "p-6",

    authContainer: "flex items-center justify-center min-h-screen bg-[#0d0d0d] w-full",
    authCard: "w-full max-w-md bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-2xl p-8 space-y-6",

    // Sidebar items
    sidebarLogoWrapper: "h-20 flex items-center justify-start px-6 border-b border-red-900/50 mb-4",
    sidebarLogo: "bg-gradient-to-br from-red-500 to-red-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl italic shadow-lg shadow-red-900/50 mr-3",
    sidebarNav: "flex-1 px-4 space-y-2",
    sidebarLink: "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-red-900/40 text-red-100",
    sidebarLinkActive: "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-red-900/80 text-white shadow-inner border-l-4 border-white",
    sidebarSubmenu: "pl-12 pr-4 py-2 space-y-2",
    sidebarSubLink: "block text-sm text-red-200 hover:text-white transition-colors py-1 flex items-center gap-2",
    sidebarSubLinkActive: "block text-sm text-white font-semibold flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-white before:rounded-full py-1",

    // Forms
    formHeading: "text-3xl font-extrabold text-white text-center mb-6",
    label: "block text-sm font-medium text-gray-300 mb-1",
    inputBase: "w-full px-4 py-2 bg-[#1a1a1a] text-white border rounded-lg focus:ring-2 outline-none transition-all placeholder-gray-600",
    inputNormal: "focus:ring-red-500/50 focus:border-red-500 border-[#333333]",
    inputError: "focus:ring-red-500 focus:border-red-500 border-red-500",
    errorContainer: "mt-4 p-4 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg text-sm text-center",

    // Buttons
    primaryButton: "w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg shadow-red-900/20",
    secondaryButton: "px-4 py-2 text-sm font-semibold text-gray-300 border border-[#333333] hover:bg-[#1a1a1a] hover:text-white rounded-lg transition-colors",
    outlineButton: "px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors",
    actionButton: "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-700 hover:bg-red-600 transition-colors shadow-sm shadow-red-900/20",
    iconButton: "p-2 hover:bg-[#222] rounded-full transition-colors text-gray-400 hover:text-white",

    // Navbar
    navHeader: "bg-[#0d0d0d] border-b border-[#222222] sticky top-0 z-10",
    navContainer: "h-20 px-6 flex items-center justify-between",
    navLeft: "flex items-center gap-4",
    navHamburger: "text-[#b30000] p-2 hover:bg-[#1a1a1a] rounded cursor-pointer transition-colors",
    navHeaderTitleBox: "flex flex-col justify-center",
    navHeaderTitle: "text-2xl font-bold text-[#b30000] tracking-wide",
    navHeaderSubtitle: "text-xs text-white font-bold flex items-center gap-1",
    navRight: "flex items-center gap-6",
    walletBox: "flex flex-col items-end justify-center",
    walletLabel: "text-xs text-white",
    walletAmount: "text-sm font-bold text-[#b30000]",
    avatarBox: "relative",
    avatarImage: "w-10 h-10 rounded-full border-2 border-[#b30000] cursor-pointer object-cover",
    dropdownMenu: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50",
    dropdownHeader: "px-4 py-3 text-sm font-bold text-gray-900 border-b",
    dropdownItem: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer",
    navSignupButton: "px-4 py-2 text-sm font-semibold text-white bg-red-700 rounded-lg hover:bg-red-600 transition-colors shadow-sm",
    navLogoIcon: "bg-gradient-to-br from-red-500 to-red-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl italic shadow-lg shadow-red-900/50",
    navLogoText: "text-2xl font-bold tracking-tight text-white hover:text-red-500 transition-colors mr-2",


    // Home
    homeCard: "bg-[#111111] rounded-xl shadow-lg p-8 max-w-2xl mx-auto mt-8 border border-[#222222]",
    homeGreeting: "text-3xl font-bold text-white mb-4",
    homeEmail: "text-red-500",
    homeText: "text-gray-400 text-lg mb-6",
    homeAdminSection: "mt-8 pt-6 border-t border-[#333333]",
    homeAdminHeading: "text-xl font-semibold mb-4 text-white",

    // App container
    testBanner: "hidden",
    testBannerHeading: "hidden",
    testBannerText: "hidden",

    // User Management
    umContainer: "",
    umHeaderBox: "flex justify-between items-center mb-6",
    umTitle: "text-2xl font-bold text-white",
    umBadge: "bg-[#1a1a1a] text-red-500 border border-red-900/50 text-sm font-medium px-3 py-1 rounded-md",
    umTableWrapper: "relative overflow-x-auto shadow-2xl rounded-lg border border-[#222222] bg-[#111111]",
    umTable: "w-full text-sm text-left text-gray-300",
    umThead: "text-xs text-white uppercase bg-[#8b0000] border-b border-[#222222]",
    umTh: "px-6 py-4 font-semibold tracking-wider",
    umTr: "bg-[#0d0d0d] border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors",
    umTd: "px-6 py-4",
    umTdBold: "px-6 py-4 font-medium text-white",

    // Switch styles
    switchWrapper: "relative inline-flex items-center cursor-pointer",
    switchInput: "sr-only peer",
    switchBg: "w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500",

    // Controls & Pagination
    searchWrapper: "flex items-center bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 w-full max-w-sm focus-within:border-red-500 transition-colors",
    searchInput: "bg-transparent outline-none text-white px-2 py-1 w-full placeholder-gray-500 text-sm",
    paginationContainer: "flex items-center justify-between mt-4 py-3 text-sm text-gray-400",
    paginationButton: "px-4 py-2 bg-[#8b0000] text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed",
    paginationActive: "bg-white text-black font-bold w-8 h-8 rounded-full flex items-center justify-center mx-1 shadow-md",
    paginationInactive: "w-8 h-8 rounded-full flex items-center justify-center mx-1 hover:bg-[#222222] transition-colors cursor-pointer text-red-500 font-medium whitespace-nowrap",
    rowsSelect: "bg-[#111111] text-white border border-[#2a2a2a] rounded-md px-2 py-1 outline-none focus:border-red-500 text-sm",

    umRoleBadgeBase: "px-2 py-1 rounded text-xs font-semibold border",
    umRoleAdmin: "bg-purple-900/30 text-purple-400 border-purple-800/50",
    umRoleUser: "bg-green-900/30 text-green-400 border-green-800/50",
    umLoading: "p-8 text-center text-gray-500",
    umError: "p-8 text-center text-red-500 font-semibold"
};

export default styles;
