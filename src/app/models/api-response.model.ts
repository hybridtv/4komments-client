export default interface ApiResponse<T> {
  data: T;
  success: boolean;
}