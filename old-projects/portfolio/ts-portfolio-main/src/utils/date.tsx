interface formatDate {
  (date: Date): string;
}

export const formatDate: formatDate = date => {
  return new Date(date).toLocaleDateString('default', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
};
