package ir.ac.sbu.evaluation.dto.university.faculty;

import ir.ac.sbu.evaluation.model.university.Faculty;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FacultySaveDto {

    @NotBlank
    private String name;

    private String webAddress = "";

    public FacultySaveDto() {
    }

    @Builder
    public FacultySaveDto(String name, String webAddress) {
        this.name = name;
        this.webAddress = webAddress == null ? "" : webAddress;
    }

    public static FacultySaveDto from(Faculty faculty) {
        return FacultySaveDto.builder()
                .name(faculty.getName())
                .webAddress(faculty.getWebAddress())
                .build();
    }

    public Faculty toFaculty() {
        return Faculty.builder()
                .name(name)
                .webAddress(webAddress)
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FacultySaveDto that = (FacultySaveDto) o;
        return Objects.equals(name, that.name)
                && Objects.equals(webAddress, that.webAddress);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, webAddress);
    }
}
