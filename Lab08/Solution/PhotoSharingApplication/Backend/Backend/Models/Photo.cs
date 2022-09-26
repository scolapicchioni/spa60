namespace Backend.Models; 
public class Photo {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string? UserName { get; set; }
    public string? Picture { get; set; }
}
