export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''
    }`;
}