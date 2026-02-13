// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper function to get role badge color
export function getRoleBadgeColor(role: string): string {
  switch (role.toLowerCase()) {
    case "super_admin":
      return "bg-blue-400 text-white";
    case "admin":
      return "bg-red-400 text-white";
    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
}

// Avatar gradient colors
export const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

// Get initials from full name
export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}
